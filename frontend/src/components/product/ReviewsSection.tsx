'use client';

import React, { useState, useMemo } from 'react';
import { Review } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReviewForm from './ReviewForm';
import { motion } from 'framer-motion';

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  isLoading: boolean;
  onReviewSubmitted: (review: Review) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  reviews,
  isLoading,
  onReviewSubmitted,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const { isAuthenticated } = useAuth();

 type RatingValue = 1 | 2 | 3 | 4 | 5;

const ratingStats = useMemo(() => {
  const stats: Record<RatingValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    stats[r.rating as RatingValue]++;
  });

  const total = reviews.length;
  const average = total ? reviews.reduce((a, b) => a + b.rating, 0) / total : 0;

  const percentages: Record<RatingValue, number> = {
    1: total ? (stats[1] / total) * 100 : 0,
    2: total ? (stats[2] / total) * 100 : 0,
    3: total ? (stats[3] / total) * 100 : 0,
    4: total ? (stats[4] / total) * 100 : 0,
    5: total ? (stats[5] / total) * 100 : 0,
  };

  return { stats, total, average, percentages };
}, [reviews]);


  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];
    if (filterBy !== 'all') result = result.filter((r) => r.rating === Number(filterBy));
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });
    return result;
  }, [reviews, sortBy, filterBy]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Customer Reviews</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-32" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-2xl">Customer Reviews</CardTitle>
          {isAuthenticated && (
            <Button onClick={() => setShowReviewForm(!showReviewForm)} variant={showReviewForm ? 'outline' : 'default'}>
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">{ratingStats.average.toFixed(1)}</div>
            <div className="flex justify-center">{renderStars(Math.round(ratingStats.average), 'md')}</div>
            <p className="text-muted-foreground">Based on {ratingStats.total} review(s)</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-sm">{star}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full">
                  <div
                    className="h-2 bg-yellow-400 rounded-full"
                    style={{ width: `${ratingStats.percentages[star as RatingValue]}%` }}
                  />
                </div>
                <span className="w-6 text-sm text-muted-foreground">{ratingStats.stats[star as RatingValue]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReviewForm
              productId={productId}
              onReviewSubmitted={onReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </motion.div>
        )}

        {/* Filter/Sort Controls */}
        {reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-4">
              <Select value={filterBy} onValueChange={(val: FilterOption) => setFilterBy(val)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(val: SortOption) => setSortBy(val)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="secondary">
              {filteredAndSortedReviews.length} review{filteredAndSortedReviews.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {filterBy === 'all'
                ? 'No reviews yet. Be the first to write one!'
                : `No ${filterBy}-star reviews found.`}
            </p>
          ) : (
            filteredAndSortedReviews.map((review, i) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b pb-6 last:border-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{review.fullName}</p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <div className="flex gap-4 pt-2">
                      <Button variant="ghost" size="sm"><ThumbsUp className="w-4 h-4 mr-1" /> Helpful</Button>
                      <Button variant="ghost" size="sm"><ThumbsDown className="w-4 h-4 mr-1" /> Not Helpful</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
