'use client';

import React, { useState, useEffect } from 'react';
import { Site as APIsite, ResourceType as APIResourceType, sitesApi, resourcesApi } from '../lib/api';
import { Card, Select, Badge } from './ui';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  TruckIcon,
} from '@heroicons/react/24/solid';
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
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Dónde necesitas reservar?
        </h2>
        <p className="text-gray-600">
          Selecciona la sede y el tipo de espacio que necesitas
        </p>
      </div>

      {/* Site Selection */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selecciona la sede</h3>
              <p className="text-sm text-gray-500">Elige la oficina donde necesitas el espacio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map((site) => {
              const isSelected = selectedSiteId === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => handleSiteChange(site.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary-500' : 'bg-gray-100'
                    }`}>
                      <BuildingOfficeIconSolid className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${
                        isSelected ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {site.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {site.address}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        {site.resources && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <UserGroupIcon className="w-3 h-3" />
                            <span>{site.resources.length} recursos</span>
                          </div>
                        )}
                        {site.config?.phoneNumber && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <PhoneIcon className="w-3 h-3" />
                            <span>Contacto</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resource Type Selection */}
      {selectedSiteId && (
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden animate-slide-up">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tipo de espacio</h3>
                <p className="text-sm text-gray-500">¿Qué tipo de recurso necesitas?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resourceTypes.map((type) => {
                const isSelected = selectedResourceType === type.code;
                return (
                  <button
                    key={type.code}
                    onClick={() => handleResourceTypeChange(type.code)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      isSelected 
                        ? 'border-success-500 bg-success-50 shadow-lg shadow-success-500/10' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 text-2xl ${
                        isSelected ? 'bg-success-500' : 'bg-gray-100'
                      }`}>
                        {type.code === 'sala' ? (
                          <BuildingOfficeIconSolid className={`w-6 h-6 ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`} />
                        ) : (
                          <TruckIcon className={`w-6 h-6 ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`} />
                        )}
                      </div>
                      
                      <h4 className={`font-semibold ${
                        isSelected ? 'text-success-900' : 'text-gray-900'
                      }`}>
                        {type.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedSiteId && selectedResourceType && selectedSite && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg overflow-hidden animate-slide-up">
          <div className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">¡Selección completada!</h4>
                  <p className="text-primary-100">
                    {resourceTypes.find(rt => rt.code === selectedResourceType)?.name} en {selectedSite.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {selectedSite.config?.phoneNumber && (
                  <div className="flex items-center space-x-2 text-primary-100">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-sm">{selectedSite.config.phoneNumber}</span>
                  </div>
                )}
                {selectedSite.config?.contactEmail && (
                  <div className="flex items-center space-x-2 text-primary-100">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="text-sm">Contacto</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4" />
                <p className="text-sm text-primary-100">
                  {selectedSite.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteResourceSelector;