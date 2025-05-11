
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Bienvenue dans l'Application de Gestion du Parc d'Attraction</h1>
        <p className="text-xl text-gray-600 mb-8">
          Une interface pour gérer les clients, les attractions et les réservations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle>Gestion des Clients</CardTitle>
            <CardDescription className="text-gray-100">
              Gérez les informations des clients
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <p className="mb-4 text-center">
              Ajoutez, modifiez et supprimez des clients du parc d'attraction.
            </p>
            <Button asChild className="w-full">
              <Link to="/customers">Voir les Clients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-secondary text-white rounded-t-lg">
            <CardTitle>Gestion des Attractions</CardTitle>
            <CardDescription className="text-gray-100">
              Gérez les attractions du parc
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <p className="mb-4 text-center">
              Ajoutez, modifiez et supprimez des attractions avec leurs caractéristiques.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/rides">Voir les Attractions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle>Gestion des Réservations</CardTitle>
            <CardDescription className="text-gray-100">
              Gérez les réservations pour les attractions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <p className="mb-4 text-center">
              Créez et gérez des réservations pour les clients sur les attractions du parc.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/bookings">Voir les Réservations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
