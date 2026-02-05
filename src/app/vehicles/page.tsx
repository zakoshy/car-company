"use client";

import { useState } from 'react';
import { getVehicles } from "@/lib/data";
import { VehicleCard } from "@/app/components/vehicle-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

export default function VehiclesPage() {
  const allVehicles = getVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('all');

  const makes = ['all', ...Array.from(new Set(allVehicles.map(v => v.make)))];

  const filteredVehicles = allVehicles
    .filter(vehicle => vehicle.status === 'Available')
    .filter(vehicle => 
      selectedMake === 'all' || vehicle.make === selectedMake
    )
    .filter(vehicle =>
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Inventory</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of hand-picked, high-quality Japanese vehicles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card border rounded-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by make, model, or year..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedMake} onValueChange={setSelectedMake}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map(make => (
              <SelectItem key={make} value={make}>
                {make === 'all' ? 'All Makes' : make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg">
          <h2 className="text-2xl font-semibold">No Vehicles Found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
