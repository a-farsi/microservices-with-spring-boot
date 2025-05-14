import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService, customerService, themeParkRideService } from '../../services/api';
import { Booking, Customer, ThemeParkRide, BookedRide } from '../../types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== 'new' && id !== undefined;

  // Récupérer la liste des clients et attractions pour les sélecteurs
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll
  });

  const { data: rides = [] } = useQuery({
    queryKey: ['rides'],
    queryFn: themeParkRideService.getAll
  });

  const form = useForm<Booking>({
    defaultValues: {
      customerId: 0,
      bookedRides: [{ rideId: 0, rideName: '', participants: 1 }],
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
    }
  });

  // Utilisation de useFieldArray pour gérer le tableau de bookedRides
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bookedRides"
  });

  // Fetch booking data if in edit mode
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(Number(id)),
    enabled: isEditMode,
    onSettled: (data, error) => {
      if (data && !error) {
        console.log("Booking data loaded:", data);

        // Format de date pour datetime-local
        const formattedStartTime = data.startTime.slice(0, 16);
        const formattedEndTime = data.endTime.slice(0, 16);

        form.reset({
          ...data,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        });
      }

      if (error) {
        console.error("Error loading booking data:", error);
        toast({
          title: 'Erreur',
          description: `Impossible de charger les données de la réservation: ${error}`,
          variant: 'destructive'
        });
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Réservation créée',
        description: 'La réservation a été créée avec succès'
      });
      navigate('/bookings');
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création de la réservation: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, booking }: { id: number, booking: Booking }) =>
        bookingService.update(id, booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Réservation mise à jour',
        description: 'La réservation a été mise à jour avec succès'
      });
      navigate('/bookings');
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour de la réservation: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: Booking) => {
    // Préparation des données pour l'API
    const booking = {
      ...data,
      customerId: Number(data.customerId),
      bookedRides: data.bookedRides.map(ride => ({
        ...ride,
        rideId: Number(ride.rideId),
        rideName: getRideName(Number(ride.rideId)),
        participants: Number(ride.participants)
      }))
    };

    console.log('Submitting booking', booking, 'isEditMode:', isEditMode);

    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), booking });
    } else {
      createMutation.mutate(booking);
    }
  };

  // Fonction utilitaire pour obtenir le nom de l'attraction
  const getRideName = (rideId: number): string => {
    const ride = rides.find(r => r.id === rideId);
    return ride ? ride.name : '';
  };

  const addRide = () => {
    append({ rideId: 0, rideName: '', participants: 1 });
  };

  return (
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/bookings')}
                className="mr-4"
            >
              <ArrowLeft size={16} />
            </Button>
            <CardTitle>
              {isEditMode ? 'Modifier la Réservation' : 'Ajouter une Réservation'}
            </CardTitle>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              value={field.value}
                          >
                            <option value="">Sélectionnez un client</option>
                            {customers.map((customer: Customer) => (
                                <option key={customer.id} value={customer.id}>
                                  {customer.firstName} {customer.lastName}
                                </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Attractions Réservées</FormLabel>
                  <Button
                      type="button"
                      onClick={addRide}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Ajouter
                  </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-md p-4 relative">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`bookedRides.${index}.rideId`}
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Attraction</FormLabel>
                                  <FormControl>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                    >
                                      <option value="">Sélectionnez une attraction</option>
                                      {rides.map((ride: ThemeParkRide) => (
                                          <option key={ride.id} value={ride.id}>
                                            {ride.name}
                                          </option>
                                      ))}
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`bookedRides.${index}.participants`}
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Participants</FormLabel>
                                  <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        {...field}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                      {fields.length > 1 && (
                          <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => remove(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                      )}
                    </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de début</FormLabel>
                          <FormControl>
                            <Input
                                type="datetime-local"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de fin</FormLabel>
                          <FormControl>
                            <Input
                                type="datetime-local"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
  );
};

export default BookingForm;