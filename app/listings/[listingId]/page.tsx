import getCurrentUser from '@/app/actions/getCurrentUser';
import getListingById from '@/app/actions/getListingById';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import React from 'react';
import ListingClient from './ListingClient';
import getReservations from '@/app/actions/getReservations';

export const metadata = {
    title: 'Airbnb | Listings',
};

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: Promise<IParams> }) => { 
    const resolvedParams = await params;  

    const listing = await getListingById(resolvedParams);
    const reservations = await getReservations(resolvedParams);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default ListingPage;
