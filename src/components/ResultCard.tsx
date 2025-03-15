
import React from 'react';
import { Calendar, MapPin, ExternalLink, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataItem } from '@/types';
import { getCategoryName } from '@/services/api';

interface ResultCardProps {
  item: DataItem;
  onClick: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ item, onClick }) => {
  const categoryColors = {
    'agriculture': 'bg-sage-100 text-sage-800 hover:bg-sage-200',
    'tender': 'bg-soil-100 text-soil-800 hover:bg-soil-200',
    'supply-chain': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  };

  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border border-border group animate-fade-in">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge className={categoryColors[item.category]}>
            {getCategoryName(item.category)}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {new Date(item.date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {item.description}
        </p>
        
        {item.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            {item.location}
          </div>
        )}
        
        {item.deadline && (
          <div className="text-sm font-medium mb-2">
            Deadline: <span className="text-amber-600">{item.deadline}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Source: {truncate(item.source, 30)}
        </div>
        <Button size="sm" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
