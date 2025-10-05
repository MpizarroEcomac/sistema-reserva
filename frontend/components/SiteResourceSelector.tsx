'use client';

import React, { useState, useEffect } from 'react';
import { Site as APIsite, ResourceType as APIResourceType, sitesApi, resourcesApi } from '../lib/api';
import { Card, Select, Badge } from './ui';
import { BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SiteResourceSelectorProps {
  onSelectionChange?: (siteId: string, resourceType?: string) => void;
  selectedSiteId?: string;
  selectedResourceType?: string;
}

const SiteResourceSelector: React.FC<SiteResourceSelectorProps> = ({
  onSelectionChange,
  selectedSiteId = '',
  selectedResourceType = '',
}) => {
  const [sites, setSites] = useState<APIsite[]>([]);
  const [resourceTypes, setResourceTypes] = useState<APIResourceType[]>([]);
  const [selectedSite, setSelectedSite] = useState<APIsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de las APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar sedes y tipos de recursos en paralelo
        const [sitesData, resourceTypesData] = await Promise.all([
          sitesApi.getAll(false), // Solo sedes activas
          resourcesApi.getTypes(),
        ]);
        
        setSites(sitesData);
        setResourceTypes(resourceTypesData);
        
        // Set selected site if provided
        if (selectedSiteId) {
          const site = sitesData.find(s => s.id === selectedSiteId);
          setSelectedSite(site || null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar las sedes y tipos de recursos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedSiteId]);

  const handleSiteChange = (siteId: string) => {
    const site = sites.find(s => s.id === siteId) || null;
    setSelectedSite(site);
    onSelectionChange?.(siteId, selectedResourceType);
  };

  const handleResourceTypeChange = (resourceType: string) => {
    if (selectedSiteId) {
      onSelectionChange?.(selectedSiteId, resourceType);
    }
  };

  const siteOptions = sites.map(site => ({
    value: site.id,
    label: site.name,
    icon: site.config?.capacity ? `📍` : undefined,
  }));

  const resourceTypeOptions = resourceTypes.map(type => ({
    value: type.code,
    label: type.name,
    icon: type.icon,
  }));

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      header={
        <div className="flex items-center space-x-2">
          <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Seleccionar Ubicación y Tipo de Recurso
          </h3>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Selector de Sede */}
        <div>
          <Select
            label="Sede"
            options={siteOptions}
            value={selectedSiteId}
            onChange={(e) => handleSiteChange(e.target.value)}
            placeholder="Selecciona una sede..."
            required
          />
          
          {selectedSite && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    {selectedSite.address}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    {selectedSite.config?.phoneNumber && (
                      <Badge variant="primary">
                        📞 {selectedSite.config.phoneNumber}
                      </Badge>
                    )}
                    {selectedSite.config?.contactEmail && (
                      <Badge variant="success">
                        📧 {selectedSite.config.contactEmail}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selector de Tipo de Recurso */}
        <div>
          <Select
            label="Tipo de Recurso"
            options={resourceTypeOptions}
            value={selectedResourceType}
            onChange={(e) => handleResourceTypeChange(e.target.value)}
            placeholder="Selecciona un tipo de recurso..."
            disabled={!selectedSiteId}
            helpText={!selectedSiteId ? "Primero selecciona una sede" : undefined}
            required
          />
        </div>

        {/* Resumen de selección */}
        {selectedSiteId && selectedResourceType && (
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <p className="text-sm text-primary-800 font-medium">
                Buscando {resourceTypes.find(rt => rt.code === selectedResourceType)?.name?.toLowerCase()} 
                {' '}en {sites.find(s => s.id === selectedSiteId)?.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SiteResourceSelector;