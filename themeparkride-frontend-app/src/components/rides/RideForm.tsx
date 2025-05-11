import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { themeParkRideService } from '../../services/api';
import { ThemeParkRide } from '../../types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const RideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== 'new' && id !== undefined;

  const form = useForm<ThemeParkRide>({
    defaultValues: {
      name: '',
      description: '',
      thrillFactor: 1,
      vomitFactor: 1
    }
  });

  useQuery({
    queryKey: ['ride', id],
    queryFn: () => themeParkRideService.getById(Number(id)),
    enabled: isEditMode,
    onSuccess: (data) => {
      if (data) {
        form.reset(data);
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: themeParkRideService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast({
        title: 'Attraction créée',
        description: 'L\'attraction a été créée avec succès'
      });
      navigate('/rides');
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création de l'attraction: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ride }: { id: number, ride: ThemeParkRide }) => 
      themeParkRideService.update(id, ride),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast({
        title: 'Attraction mise à jour',
        description: 'L\'attraction a été mise à jour avec succès'
      });
      navigate('/rides');
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour de l'attraction: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: ThemeParkRide) => {
    console.log('Submitting ride', data, 'isEditMode:', isEditMode);

    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), ride: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/rides')}
            className="mr-4"
          >
            <ArrowLeft size={16} />
          </Button>
          <CardTitle>
            {isEditMode ? 'Modifier l\'Attraction' : 'Ajouter une Attraction'}
          </CardTitle>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'attraction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de l'attraction"
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="thrillFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facteur de Sensation (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vomitFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facteur de Vertige (1-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
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

export default RideForm;
