import React from 'react';

const MongoDBChartDashboard = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        style={{
          background: '#F1F5F4',
          border: 'none',
          borderRadius: '2px',
          boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          width: '100%',
          height: '100%',
        }}
        src="https://charts.mongodb.com/charts-immobilier-qovhpna/embed/dashboards?id=669fecab-4d28-4756-8cfb-d514c707ac08&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
        title="MongoDB Chart Dashboard"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default MongoDBChartDashboard;
