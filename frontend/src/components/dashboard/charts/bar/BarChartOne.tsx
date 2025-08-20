

import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export default function BarChartOne() {
  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Poppins, sans-serif',
      type: 'bar',
      height: 335,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      }
    },
    responsive: [{
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
      type: 'category',
      range: undefined,
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 1000,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        size: 6,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [
            {
              offset: 0,
              color: '#4318FF',
              opacity: 1,
            },
            {
              offset: 100,
              color: 'rgba(67, 24, 255, 1)',
              opacity: 0.8,
            },
          ],
        ],
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 15,
        right: 10,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val + 'K';
        },
      },
    },
  };

  const series = [
    {
      name: 'Sales',
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" className="min-w-[1000px]">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={335}
        />
      </div>
    </div>
  );
}
