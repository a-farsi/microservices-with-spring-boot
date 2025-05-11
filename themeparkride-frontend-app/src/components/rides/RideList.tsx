
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { themeParkRideService } from '../../services/api';
import { ThemeParkRide } from '../../types/models';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

const RideList = () => {
  const queryClient = useQueryClient();

  const { data: rides = [], isLoading, error } = useQuery({
    queryKey: ['rides'],
    queryFn: themeParkRideService.getAll
  });

  const deleteRideMutation = useMutation({
    mutationFn: themeParkRideService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast({
        title: 'Attraction supprimée',
        description: 'L\'attraction a été supprimée avec succès',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression de l'attraction: ${error}`,
        variant: 'destructive',
      });
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette attraction?')) {
      deleteRideMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8">Chargement des attractions...</div>;
  if (error) return <div className="text-red-500 p-4">Erreur lors du chargement des attractions</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Attractions</h1>
        <Button asChild className="flex items-center">
          <Link to="/rides/new">
            <Plus className="mr-2" size={16} />
            Ajouter une Attraction
          </Link>
        </Button>
      </div>

      {rides.length === 0 ? (
        <div className="text-center p-8">
          <p>Aucune attraction trouvée.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Facteur de Sensation</TableHead>
              <TableHead>Facteur de Vertige</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride: ThemeParkRide) => (
              <TableRow key={ride.id}>
                <TableCell>{ride.id}</TableCell>
                <TableCell>{ride.name}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{ride.description}</div>
                </TableCell>
                <TableCell>{ride.thrillFactor}</TableCell>
                <TableCell>{ride.vomitFactor}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/rides/${ride.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(ride.id!)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RideList;
