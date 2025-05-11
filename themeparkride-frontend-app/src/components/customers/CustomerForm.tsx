import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/api';
import { Customer } from '../../types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== 'new';

  const form = useForm<Customer>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    }
  });

  // Utiliser useQuery avec la configuration correcte
  const { isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(Number(id)),
    enabled: isEditMode,
    onSettled: (data) => {
      if (data) {
        form.reset(data);
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ 
        title: 'Client créé',
        description: 'Le client a été créé avec succès' 
      });
      navigate('/customers');
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur',
        description: `Erreur lors de la création du client: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, customer }: { id: number, customer: Customer }) => 
      customerService.update(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ 
        title: 'Client mis à jour',
        description: 'Le client a été mis à jour avec succès' 
      });
      navigate('/customers');
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur',
        description: `Erreur lors de la mise à jour du client: ${error}`,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: Customer) => {
    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), customer: data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoadingCustomer) {
    return <div className="flex justify-center p-8">Chargement des données du client...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            className="mr-4"
          >
            <ArrowLeft size={16} />
          </Button>
          <CardTitle>{isEditMode ? 'Modifier le Client' : 'Ajouter un Client'}</CardTitle>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default CustomerForm;
