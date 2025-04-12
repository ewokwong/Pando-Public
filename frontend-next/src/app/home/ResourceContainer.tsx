"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceBox from './ResourceBox';
import { Search, Filter, Loader2, AlertCircle, BookOpen, BookOpenCheck } from 'lucide-react';

// Define the type for a single resource
interface Resource {
    _id: string;
    title: string;
    description: string;
    level: string;
    tags: Record<string, boolean>;
    created_by: string;
    upvoted_by: string[];
    downvoted_by: string[];
    [key: string]: any;
}

const ResourceContainer: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get<Resource[]>(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/get-resources`);
                setResources(response.data);
                setFilteredResources(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching resources:', error);
                setError('Failed to load resources. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    useEffect(() => {
        // Filter resources based on search term and selected level
        const filtered = resources.filter(resource => {
            const matchesSearch = searchTerm === '' || 
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLevel = selectedLevel === '' || resource.level === selectedLevel;
            
            return matchesSearch && matchesLevel;
        });
        
        setFilteredResources(filtered);
    }, [searchTerm, selectedLevel, resources]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLevel(e.target.value);
    };

    const levelOptions = [
        { value: '', label: 'All Levels' },
        { value: 'Unsure', label: 'Unsure' },
        { value: 'For Beginners (UTR 1 - 4)', label: 'Beginners (UTR 1 - 4)' },
        { value: 'For Intermediate (UTR 4 - 8)', label: 'Intermediate (UTR 4 - 8)' },
        { value: 'For Competitive (UTR 8 - 12)', label: 'Competitive (UTR 8 - 12)' },
        { value: 'For Professional (UTR 12 - 16)', label: 'Professional (UTR 12 - 16)' },
    ];

    return (
        <div className="flex flex-col w-full h-[calc(100%-40px)] max-h-[calc(100%-40px)]">
            {/* Search and Filter Bar */}
            <div className="mb-2 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <Search size={12} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-7 pr-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                </div>
                <div className="relative sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <Filter size={12} className="text-gray-400" />
                    </div>
                    <select
                        value={selectedLevel}
                        onChange={handleLevelChange}
                        className="pl-7 pr-2 py-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-xs"
                    >
                        {levelOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            {!isLoading && !error && (
                <div className="mb-1 text-xs text-gray-300">
                    Showing {filteredResources.length} of {resources.length} resources
                </div>
            )}

            {/* Content Area - Explicitly set height */}
            <div className="h-[calc(100%)] overflow-hidden bg-white/10 backdrop-blur-sm rounded-lg p-2">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full py-4">
                        <Loader2 size={24} className="text-blue-500 animate-spin mb-2" />
                        <p className="text-white text-xs">Loading resources...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <AlertCircle size={24} className="text-red-400 mb-2" />
                        <p className="text-red-300 font-medium text-xs mb-1">Something went wrong</p>
                        <p className="text-gray-300 text-xs mb-2">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredResources.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <BookOpen size={24} className="text-gray-300 mb-2" />
                        <p className="text-gray-200 font-medium text-xs mb-1">No resources found</p>
                        <p className="text-gray-300 text-xs mb-2">
                            {searchTerm || selectedLevel 
                                ? "Try adjusting your search or filter criteria" 
                                : "Be the first to add a resource!"}
                        </p>
                        {(searchTerm || selectedLevel) && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedLevel('');
                                }}
                                className="px-2 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Resources List - Scrollable container with fixed height */}
                {!isLoading && !error && filteredResources.length > 0 && (
                    <div className="h-full overflow-y-auto pr-1">
                        <div className="space-y-6 pb-8">
                            {filteredResources.map((resource) => (
                                <ResourceBox key={resource._id} resource={resource} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceContainer;
