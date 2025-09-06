import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Building, DollarSign, TrendingUp } from 'lucide-react';

export function MapSection() {
  return (
    <Card className="w-full h-[500px] border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MapPin className="h-5 w-5 text-tabiya-accent" />
          Job Opportunities Map
        </CardTitle>
        <CardDescription className="text-gray-600">
          Discover job opportunities based on your skill matches
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        {/* Placeholder for map implementation */}
        <div className="h-full bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
          <MapPin className="h-12 w-12 mb-4 opacity-50 text-tabiya-accent" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Interactive Map Coming Soon
          </h3>
          <p className="text-center mb-6 max-w-md text-gray-600">
            This section will display an interactive map showing job
            opportunities in your area based on your skills and career matches.
          </p>

          {/* Sample job locations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-tabiya-accent" />
                <span className="font-medium text-gray-900">
                  Tech Hub District
                </span>
              </div>
              <p className="text-sm text-gray-600">
                15 Full Stack Developer positions
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <DollarSign className="h-3 w-3" />
                <span>$75k - $120k</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-tabiya-accent" />
                <span className="font-medium text-gray-900">
                  Business Center
                </span>
              </div>
              <p className="text-sm text-gray-600">8 Product Manager roles</p>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <DollarSign className="h-3 w-3" />
                <span>$85k - $140k</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-tabiya-accent" />
                <span className="font-medium text-gray-900">
                  Innovation Quarter
                </span>
              </div>
              <p className="text-sm text-gray-600">
                12 Technical Lead positions
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <TrendingUp className="h-3 w-3" />
                <span>High demand</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
