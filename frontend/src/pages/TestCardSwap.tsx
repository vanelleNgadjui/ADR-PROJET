import React from 'react';
import CardSwap, { Card } from '../components/ui/CardSwap';
import cardConcertPng from '../assets/Card-concerts.png';
import cardConcertSvg from '../assets/Card-concerts.svg';
import card1Svg from '../assets/Card-1.svg';
import card2Svg from '../assets/Card-2.svg';
import card3Svg from '../assets/Card-3.svg';
import card4Svg from '../assets/Card-4.svg';
import PageTitle from '../components/common/PageTitle';

const TestCardSwap: React.FC = () => {
  return (
    <>
      <PageTitle 
        title="Test CardSwap" 
        description="Test du composant CardSwap avec images de background et différents styles"
      />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test CardSwap avec Images et Styles
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test avec PNG - Cover */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">PNG - Cover (défaut)</h2>
              <div className="flex justify-center">
                <CardSwap width={400} height={300} delay={3000}>
                  <Card backgroundImage={cardConcertPng} backgroundSize="cover" />
                  <Card backgroundImage={cardConcertPng} backgroundSize="cover" />
                  <Card backgroundImage={cardConcertPng} backgroundSize="cover" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec PNG - Contain */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">PNG - Contain</h2>
              <div className="flex justify-center">
                <CardSwap width={400} height={300} delay={3000}>
                  <Card backgroundImage={cardConcertPng} backgroundSize="contain" />
                  <Card backgroundImage={cardConcertPng} backgroundSize="contain" />
                  <Card backgroundImage={cardConcertPng} backgroundSize="contain" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec SVG - Cover */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">SVG - Cover</h2>
              <div className="flex justify-center">
                <CardSwap width={400} height={300} delay={3000}>
                  <Card backgroundImage={cardConcertSvg} backgroundSize="cover" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="cover" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="cover" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec SVG - Contain */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">SVG - Contain</h2>
              <div className="flex justify-center">
                <CardSwap width={400} height={300} delay={3000}>
                  <Card backgroundImage={cardConcertSvg} backgroundSize="contain" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="contain" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="contain" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec différentes positions */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Différentes Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium mb-2">Top Left</h3>
                  <div className="flex justify-center">
                    <CardSwap width={200} height={150} delay={4000}>
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="top left" />
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="top left" />
                    </CardSwap>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium mb-2">Center (défaut)</h3>
                  <div className="flex justify-center">
                    <CardSwap width={200} height={150} delay={4000}>
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="center" />
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="center" />
                    </CardSwap>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium mb-2">Bottom Right</h3>
                  <div className="flex justify-center">
                    <CardSwap width={200} height={150} delay={4000}>
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="bottom right" />
                      <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="bottom right" />
                    </CardSwap>
                  </div>
                </div>
              </div>
            </div>

            {/* Test avec repeat */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Background Repeat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium mb-2">No Repeat (défaut)</h3>
                  <div className="flex justify-center">
                    <CardSwap width={300} height={200} delay={4000}>
                      <Card backgroundImage={cardConcertPng} backgroundSize="100px 100px" backgroundRepeat="no-repeat" />
                      <Card backgroundImage={cardConcertPng} backgroundSize="100px 100px" backgroundRepeat="no-repeat" />
                    </CardSwap>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium mb-2">Repeat</h3>
                  <div className="flex justify-center">
                    <CardSwap width={300} height={200} delay={4000}>
                      <Card backgroundImage={cardConcertPng} backgroundSize="100px 100px" backgroundRepeat="repeat" />
                      <Card backgroundImage={cardConcertPng} backgroundSize="100px 100px" backgroundRepeat="repeat" />
                    </CardSwap>
                  </div>
                </div>
              </div>
            </div>

            {/* Test mixte PNG/SVG avec différents styles */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Test Mixte avec Différents Styles</h2>
              <div className="flex justify-center">
                <CardSwap width={500} height={350} delay={4000}>
                  <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="top left" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="contain" backgroundPosition="center" />
                  <Card backgroundImage={cardConcertPng} backgroundSize="cover" backgroundPosition="bottom right" />
                  <Card backgroundImage={cardConcertSvg} backgroundSize="contain" backgroundPosition="top" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec Card-1 à Card-4 en style contain */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Card-1 à Card-4 - Style Contain</h2>
              <div className="flex justify-center">
                <CardSwap width={420} height={320} verticalDistance={38} delay={3500}>
                  <Card backgroundImage={card1Svg} backgroundSize="contain" backgroundPosition="center" />
                  <Card backgroundImage={card2Svg} backgroundSize="contain" backgroundPosition="center" />
                  <Card backgroundImage={card3Svg} backgroundSize="contain" backgroundPosition="center" />
                  <Card backgroundImage={card4Svg} backgroundSize="contain" backgroundPosition="center" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec Card-1 à Card-4 en style cover */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Card-1 à Card-4 - Style Cover</h2>
              <div className="flex justify-center">
                <CardSwap width={420} height={320} verticalDistance={38} delay={3500}>
                  <Card backgroundImage={card1Svg} backgroundSize="cover" backgroundPosition="center" />
                  <Card backgroundImage={card2Svg} backgroundSize="cover" backgroundPosition="center" />
                  <Card backgroundImage={card3Svg} backgroundSize="cover" backgroundPosition="center" />
                  <Card backgroundImage={card4Svg} backgroundSize="cover" backgroundPosition="center" />
                </CardSwap>
              </div>
            </div>

            {/* Test avec Card-1 à Card-4 en style 100% 100% */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Card-1 à Card-4 - Style 100% 100%</h2>
              <div className="flex justify-center">
                <CardSwap width={420} height={320} verticalDistance={38} delay={3500}>
                  <Card backgroundImage={card1Svg} backgroundSize="540 400" backgroundPosition="center" />
                  <Card backgroundImage={card2Svg} backgroundSize="540 400" backgroundPosition="center" />
                  <Card backgroundImage={card3Svg} backgroundSize="540 400" backgroundPosition="center" />
                  <Card backgroundImage={card4Svg} backgroundSize="540 400" backgroundPosition="center" />
                </CardSwap>
              </div>
            </div>

            {/* Test sans image (fallback black) */}
            <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Test sans image (fallback black)</h2>
              <div className="flex justify-center">
                <CardSwap width={400} height={300} delay={3000}>
                  <Card />
                  <Card />
                  <Card />
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCardSwap;
