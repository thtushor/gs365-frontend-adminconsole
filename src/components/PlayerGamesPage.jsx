import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_LIST } from '../api/ApiList';
import axios from '../api/axios';
import { FaArrowLeft } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import Pagination from './Pagination';

const PlayerGamesPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchGameStats = async ({ queryKey }) => {
    const [_, { userId, page, pageSize }] = queryKey;
    const response = await axios.get(API_LIST.GAME_STATS, {
      params: { userId, page, pageSize }
    });
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['gameStats', { userId: playerId, page: currentPage, pageSize }],
    queryFn: fetchGameStats,
    enabled: !!playerId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const gameStats = data?.data || [];
  const pagination = data?.pagination || {};
  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };



  const handleBackToProfile = () => {
    navigate(`/players/${playerId}/profile`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };





  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Games Statistics</h1>
              <p className="text-gray-600">Detailed game performance analytics for player ID: {playerId}</p>
            </div>
            <button
              onClick={handleBackToProfile}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Player Profile
            </button>
          </div>
        </div>



        {/* Games Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Game Performance Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">
                Loading game statistics...
              </div>
            ) : isError ? (
              <div className="text-center text-red-500 py-8">
                Failed to load game statistics.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bet Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loss Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Bet
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gameStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={stat.game?.gameLogo || '/placeholder-game.png'} 
                            alt={stat.game?.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-game.png';
                            }}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {stat.game?.name || 'Unknown Game'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stat.game?.status || 'Unknown Status'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={stat.provider?.logo || '/placeholder-provider.png'} 
                            alt={stat.provider?.name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-provider.png';
                            }}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {stat.provider?.name || 'Unknown Provider'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stat.provider?.country || 'Unknown Country'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.totalBets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(stat.totalBetAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(stat.totalWinAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {formatCurrency(stat.totalLossAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(stat.winRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">
                            {stat.lastBetPlaced ? new Date(stat.lastBetPlaced).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />


        </div>
      </div>
    </div>
  );
};

export default PlayerGamesPage;
