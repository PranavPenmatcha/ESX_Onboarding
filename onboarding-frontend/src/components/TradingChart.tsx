import React from 'react';

const TradingChart: React.FC = () => {
  // Generate highly dynamic and varied stock market candlestick data
  const generateStockMarketData = () => {
    const data = [];
    const numBars = 80;
    let currentPrice = 100; // Starting price
    let trend = 1; // 1 for uptrend, -1 for downtrend
    let trendDuration = 0;
    let volatilityPhase = 1; // Volatility multiplier

    for (let i = 0; i < numBars; i++) {
      // Change trend very frequently for sporadic movement
      if (trendDuration > 3 + Math.random() * 5) {
        trend *= -1;
        trendDuration = 0;
        // Frequently change volatility phase
        if (Math.random() > 0.5) {
          volatilityPhase = 0.3 + Math.random() * 3; // 0.3x to 3.3x volatility
        }
      }
      trendDuration++;

      // Extremely sporadic volatility and movement
      const baseVolatility = 5 + Math.random() * 15; // Much higher base volatility
      const volatility = baseVolatility * volatilityPhase;
      const trendStrength = trend * (0.5 + Math.random() * 6); // More random trend strength

      // Add frequent dramatic spikes
      const spikeChance = Math.random();
      let spike = 0;
      if (spikeChance > 0.85) { // More frequent spikes
        spike = (Math.random() - 0.5) * 25; // Even more dramatic spikes
      }

      // Add random direction changes regardless of trend
      const randomDirectionChange = (Math.random() - 0.5) * 8;

      // Generate OHLC with extremely sporadic variation
      const open = currentPrice;
      const close = open + trendStrength + (Math.random() - 0.5) * volatility + spike + randomDirectionChange;

      // Much more dramatic wicks
      const wickVariation = volatility * (0.5 + Math.random() * 1.5);
      const high = Math.max(open, close) + Math.random() * wickVariation;
      const low = Math.min(open, close) - Math.random() * wickVariation;

      // Determine candle properties
      const isBullish = close > open;
      const bodyHeight = Math.abs(close - open);
      const wickTop = high - Math.max(open, close);
      const wickBottom = Math.min(open, close) - low;

      // More varied color pattern
      const color = (i % 3 === 0) ? '#F3CA9A' : '#CCCCCC';

      // More dramatic height scaling
      const scaledBodyHeight = Math.max(8, bodyHeight * 12); // Bigger scaling
      const scaledWickTop = Math.max(1, wickTop * 3); // Further reduced wick scaling from 6 to 3
      const scaledWickBottom = Math.max(1, wickBottom * 3); // Further reduced wick scaling from 6 to 3

      // Calculate position with constrained scaling to ensure visibility
      const priceMovement = currentPrice - 100; // Movement from starting price
      const normalizedPosition = Math.max(-15, Math.min(15, (priceMovement / 40) * 20)); // Constrain to ±15% of chart height

      data.push({
        height: scaledBodyHeight,
        color,
        errorBarLength: Math.max(scaledWickTop, scaledWickBottom),
        wickTop: scaledWickTop,
        wickBottom: scaledWickBottom,
        isBullish,
        open,
        high,
        low,
        close,
        currentPrice,
        priceMovement: normalizedPosition,
        volatility: volatility // Store for potential use
      });

      currentPrice = close;
    }

    return data;
  };

  const candlesticks = generateStockMarketData();

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '40vh', // Match the container height
      backgroundColor: 'transparent',
      overflow: 'visible', // Changed from hidden to visible
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)'
    }}>
      {/* Dotted x-axis line */}
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '0',
        right: '0',
        height: '2px',
        borderTop: '2px dotted #666',
        transform: 'translateY(-50%)',
        zIndex: 1,
        opacity: 0.6 // Slightly more visible
      }}></div>

      {/* Chart candlesticks container */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: '2px',
        padding: '0 1vw'
      }}>
        {candlesticks.map((candle, index) => {
          const centerY = 60; // Center position for stock chart (matches dotted line)
          const basePosition = centerY + candle.priceMovement; // Bodies follow the trending price path

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                width: 'calc((100vw - 4vw) / 80)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Upper wick - extends from top of body */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: `calc(${basePosition}% - ${candle.height/2}px - ${candle.wickTop}px)`,
                width: '1px', // Reduced from 2px to 1px
                height: `${candle.wickTop}px`,
                backgroundColor: candle.color,
                opacity: 0.7, // Reduced opacity from 0.9 to 0.7
                transform: 'translateX(-50%)',
                zIndex: 3
              }}></div>

              {/* Candlestick body - centered on dotted axis */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: `calc(${basePosition}% - ${candle.height/2}px)`,
                width: candle.height > 30 ? '90%' : '70%',
                height: `${candle.height}px`,
                backgroundColor: candle.color,
                opacity: candle.isBullish ? 0.95 : 0.7,
                borderRadius: candle.height > 40 ? '2px' : '1px',
                transform: 'translateX(-50%)',
                zIndex: 2,
                border: candle.isBullish ? 'none' : `2px solid ${candle.color}`,
                boxShadow: candle.height > 50 ? `0 0 4px ${candle.color}40` : 'none'
              }}></div>

              {/* Lower wick - extends from bottom of body */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: `calc(${basePosition}% + ${candle.height/2}px)`,
                width: '1px', // Reduced from 2px to 1px
                height: `${candle.wickBottom}px`,
                backgroundColor: candle.color,
                opacity: 0.7, // Reduced opacity from 0.9 to 0.7
                transform: 'translateX(-50%)',
                zIndex: 3
              }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradingChart;
