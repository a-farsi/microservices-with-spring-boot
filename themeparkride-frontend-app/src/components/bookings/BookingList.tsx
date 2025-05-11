
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService, customerService, themeParkRideService } from '../../services/api';
import { Booking, Customer, ThemeParkRide } from '../../types/models';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR');
};

const BookingList = () => {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAll
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll
  });

  const { data: rides = [] } = useQuery({
    queryKey: ['rides'],
    queryFn: themeParkRideService.getAll
  });

  const deleteBookingMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Réservation supprimée',
        description: 'La réservation a été supprimée avec succès',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression de la réservation: ${error}`,
        variant: 'destructive',
      });
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      deleteBookingMutation.mutate(id);
    }
  };

  // Fonction utilitaire pour obtenir le nom du client
  const getCustomerName = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : `Client #${customerId}`;
  };

  // Fonction utilitaire pour afficher les attractions réservées
  const getBookedRidesInfo = (bookedRides: any[] = []) => {
    if (!bookedRides || !Array.isArray(bookedRides) || bookedRides.length === 0) return '';
    
    return bookedRides.map(ride => {
      const rideName = ride.rideName || `Attraction #${ride.rideId}`;
      return `${rideName} (${ride.participants} participants)`;
    }).join(', ');
  };

  if (isLoadingBookings) return <div className="flex justify-center p-8">Chargement des réservations...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Réservations</h1>
        <Button asChild className="flex items-center">
          <Link to="/bookings/new">
            <Plus className="mr-2" size={16} />
            Ajouter une Réservation
          </Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center p-8">
          <p>Aucune réservation trouvée.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Attractions</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking: Booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{getCustomerName(booking.customerId)}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {getBookedRidesInfo(booking.bookedRides)}
                  </div>
                </TableCell>
                <TableCell>{formatDate(booking.startTime)}</TableCell>
                <TableCell>{formatDate(booking.endTime)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/bookings/${booking.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(booking.id!)}
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

export default BookingList;
