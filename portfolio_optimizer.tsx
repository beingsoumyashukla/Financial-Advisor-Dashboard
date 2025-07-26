import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Moon, Sun, Info, TrendingUp, DollarSign, Shield, AlertTriangle, CheckCircle, BookOpen, Calculator } from 'lucide-react';

const PortfolioOptimizer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [showEducation, setShowEducation] = useState(false);
  
  // User inputs
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [currentPortfolio, setCurrentPortfolio] = useState({
    stocks: 60,
    bonds: 30,
    alternatives: 5,
    cash: 5
  });
  
  // Advanced settings
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [rebalanceFreq, setRebalanceFreq] = useState('quarterly');

  // Asset data for recommendations
  const assetData = {
    stocks: [
      { symbol: 'VTI', name: 'Total Stock Market ETF', risk: 0.15, expectedReturn: 0.10, category: 'US Equity' },
      { symbol: 'VXUS', name: 'International Stocks ETF', risk: 0.18, expectedReturn: 0.09, category: 'International' },
      { symbol: 'QQQ', name: 'Nasdaq 100 ETF', risk: 0.22, expectedReturn: 0.12, category: 'Growth' },
      { symbol: 'VTV', name: 'Value Stocks ETF', risk: 0.16, expectedReturn: 0.09, category: 'Value' }
    ],
    bonds: [
      { symbol: 'BND', name: 'Total Bond Market ETF', risk: 0.04, expectedReturn: 0.04, category: 'Government' },
      { symbol: 'VTEB', name: 'Tax-Exempt Bond ETF', risk: 0.05, expectedReturn: 0.035, category: 'Municipal' },
      { symbol: 'SCHZ', name: 'Treasury ETF', risk: 0.03, expectedReturn: 0.035, category: 'Treasury' }
    ],
    alternatives: [
      { symbol: 'VNQ', name: 'Real Estate ETF', risk: 0.19, expectedReturn: 0.08, category: 'REITs' },
      { symbol: 'IAU', name: 'Gold ETF', risk: 0.16, expectedReturn: 0.05, category: 'Commodities' },
      { symbol: 'DBC', name: 'Commodities ETF', risk: 0.20, expectedReturn: 0.06, category: 'Commodities' }
    ]
  };

  // Risk profiles
  const riskProfiles = {
    low: { stocks: 30, bonds: 60, alternatives: 5, cash: 5, maxRisk: 0.08, targetReturn: 0.05 },
    medium: { stocks: 60, bonds: 30, alternatives: 8, cash: 2, maxRisk: 0.12, targetReturn: 0.08 },
    high: { stocks: 80, bonds: 15, alternatives: 5, cash: 0, maxRisk: 0.18, targetReturn: 0.12 }
  };

  // Modern Portfolio Theory optimization
  const optimizePortfolio = useMemo(() => {
    const profile = riskProfiles[riskTolerance];
    const adjustmentFactor = expectedReturn / (profile.targetReturn * 100);
    
    // ML-inspired optimization: adjust allocations based on user preferences
    const optimized = {
      stocks: Math.min(90, Math.max(20, profile.stocks * adjustmentFactor)),
      bonds: Math.min(70, Math.max(10, profile.bonds * (2 - adjustmentFactor))),
      alternatives: Math.min(20, Math.max(0, profile.alternatives)),
      cash: Math.max(0, 100 - (profile.stocks * adjustmentFactor + profile.bonds * (2 - adjustmentFactor) + profile.alternatives))
    };

    // Normalize to 100%
    const total = Object.values(optimized).reduce((sum, val) => sum + val, 0);
    Object.keys(optimized).forEach(key => {
      optimized[key] = Math.round((optimized[key] / total) * 100);
    });

    return optimized;
  }, [riskTolerance, expectedReturn]);

  // Calculate portfolio metrics
  const calculateMetrics = (portfolio) => {
    const weights = {
      stocks: portfolio.stocks / 100,
      bonds: portfolio.bonds / 100,
      alternatives: portfolio.alternatives / 100,
      cash: portfolio.cash / 100
    };

    const expectedReturns = { stocks: 0.10, bonds: 0.04, alternatives: 0.07, cash: 0.02 };
    const risks = { stocks: 0.16, bonds: 0.04, alternatives: 0.12, cash: 0.01 };

    const portfolioReturn = Object.keys(weights).reduce((sum, asset) => 
      sum + weights[asset] * expectedReturns[asset], 0);
    
    const portfolioRisk = Math.sqrt(Object.keys(weights).reduce((sum, asset) => 
      sum + Math.pow(weights[asset] * risks[asset], 2), 0));

    const sharpeRatio = (portfolioReturn - 0.02) / portfolioRisk;

    return {
      expectedReturn: portfolioReturn,
      risk: portfolioRisk,
      sharpeRatio: sharpeRatio
    };
  };

  const currentMetrics = calculateMetrics(currentPortfolio);
  const optimizedMetrics = calculateMetrics(optimizePortfolio);

  // Chart data
  const comparisonData = [
    { name: 'Current', ...currentPortfolio, return: currentMetrics.expectedReturn * 100, risk: currentMetrics.risk * 100 },
    { name: 'Optimized', ...optimizePortfolio, return: optimizedMetrics.expectedReturn * 100, risk: optimizedMetrics.risk * 100 }
  ];

  const projectionData = Array.from({ length: timeHorizon + 1 }, (_, i) => {
    const currentValue = investmentAmount * Math.pow(1 + currentMetrics.expectedReturn, i);
    const optimizedValue = investmentAmount * Math.pow(1 + optimizedMetrics.expectedReturn, i);
    return {
      year: i,
      current: Math.round(currentValue),
      optimized: Math.round(optimizedValue)
    };
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const PieChartComponent = ({ data, title }) => {
    const chartData = Object.entries(data).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }));

    return (
      <div className="w-full h-64">
        <h4 className="text-center font-medium mb-2">{title}</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const EducationPanel = () => (
    <div className={`mt-6 p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Portfolio Education</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Modern Portfolio Theory</h4>
          <p className="text-sm mb-3">MPT suggests that investors can construct portfolios to maximize expected return for a given level of risk by carefully choosing proportions of various assets.</p>
          
          <h4 className="font-medium mb-2">Diversification Benefits</h4>
          <p className="text-sm">Spreading investments across different asset classes reduces overall portfolio risk without necessarily reducing returns.</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Risk-Return Tradeoff</h4>
          <p className="text-sm mb-3">Higher expected returns typically come with higher risk. The key is finding the right balance for your goals and timeline.</p>
          
          <h4 className="font-medium mb-2">Rebalancing Importance</h4>
          <p className="text-sm">Regular rebalancing maintains your target allocation and can improve long-term returns while managing risk.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Portfolio Optimizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">AI-Powered Portfolio Optimization & Analysis</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEducation(!showEducation)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            >
              <BookOpen className="w-4 h-4" />
              Learn
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'input', label: 'Portfolio Input', icon: Calculator },
            { id: 'analysis', label: 'Analysis', icon: TrendingUp },
            { id: 'recommendations', label: 'Recommendations', icon: CheckCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        {activeTab === 'input' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Portfolio Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="low">Conservative (Low Risk)</option>
                    <option value="medium">Moderate (Medium Risk)</option>
                    <option value="high">Aggressive (High Risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-1 font-medium">{expectedReturn}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Investment Timeline (Years)</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-1 font-medium">{timeHorizon} years</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    min="1000"
                    step="1000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentPortfolio).map(([asset, value]) => (
                    <div key={asset}>
                      <label className="block text-sm font-medium mb-2 capitalize">{asset} (%)</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setCurrentPortfolio(prev => ({
                          ...prev,
                          [asset]: Math.max(0, Math.min(100, Number(e.target.value)))
                        }))}
                        className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Portfolio Visualization */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Current Portfolio</h2>
              <PieChartComponent data={currentPortfolio} title="Asset Allocation" />
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Expected Return</div>
                  <div className="text-xl font-bold text-green-600">{(currentMetrics.expectedReturn * 100).toFixed(1)}%</div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
                  <div className="text-xl font-bold text-orange-600">{(currentMetrics.risk * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Portfolio Comparison */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Portfolio Comparison</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <PieChartComponent data={currentPortfolio} title="Current" />
                <PieChartComponent data={optimizePortfolio} title="Optimized" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <span>Expected Return</span>
                  <div className="flex gap-4">
                    <span className="text-gray-600">{(currentMetrics.expectedReturn * 100).toFixed(1)}%</span>
                    <span className="text-green-600 font-bold">→ {(optimizedMetrics.expectedReturn * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <span>Risk Level</span>
                  <div className="flex gap-4">
                    <span className="text-gray-600">{(currentMetrics.risk * 100).toFixed(1)}%</span>
                    <span className="text-blue-600 font-bold">→ {(optimizedMetrics.risk * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <span>Sharpe Ratio</span>
                  <div className="flex gap-4">
                    <span className="text-gray-600">{currentMetrics.sharpeRatio.toFixed(2)}</span>
                    <span className="text-purple-600 font-bold">→ {optimizedMetrics.sharpeRatio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Projection */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Growth Projection</h2>
              
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current Portfolio" strokeWidth={2} />
                    <Line type="monotone" dataKey="optimized" stroke="#82ca9d" name="Optimized Portfolio" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Portfolio</div>
                  <div className="text-xl font-bold">${projectionData[projectionData.length - 1]?.current.toLocaleString()}</div>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Optimized Portfolio</div>
                  <div className="text-xl font-bold text-green-600">${projectionData[projectionData.length - 1]?.optimized.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* Asset Recommendations */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Recommended Assets</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(assetData).map(([category, assets]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium mb-4 capitalize">{category}</h3>
                    <div className="space-y-3">
                      {assets.map(asset => (
                        <div key={asset.symbol} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-green-600">{(asset.expectedReturn * 100).toFixed(1)}%</div>
                              <div className="text-xs text-gray-500">Expected Return</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Risk: {(asset.risk * 100).toFixed(1)}%</span>
                            <span className="text-blue-600">{asset.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rebalancing Strategy */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-6">Rebalancing Strategy</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Recommended Actions</h3>
                  <div className="space-y-3">
                    {Object.entries(optimizePortfolio).map(([asset, optimized]) => {
                      const current = currentPortfolio[asset];
                      const difference = optimized - current;
                      const action = difference > 0 ? 'Increase' : difference < 0 ? 'Decrease' : 'Maintain';
                      const color = difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600';
                      
                      return (
                        <div key={asset} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="flex justify-between items-center">
                            <span className="capitalize font-medium">{asset}</span>
                            <div className={`${color} font-bold`}>
                              {action} {Math.abs(difference).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {current}% → {optimized}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Implementation Timeline</h3>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="font-medium">Phase 1: Immediate (0-30 days)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reduce overweight positions and increase cash for reallocation</div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="font-medium">Phase 2: Short-term (1-3 months)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Gradually build positions in underweight asset classes</div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="font-medium">Phase 3: Ongoing</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Quarterly rebalancing to maintain target allocation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education Panel */}
        {showEducation && <EducationPanel />}
      </div>
    </div>
  );
};

export default PortfolioOptimizer;