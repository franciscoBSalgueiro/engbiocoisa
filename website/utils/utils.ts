import { MajorReview, Review } from "@prisma/client";

export function getAverageReviewRatings(reviews: Review[]) {
  const averages = {
    education: 0,
    extraActivities: 0,
    infrastructure: 0,
    location: 0,
    overallQuality: 0,
  };

  reviews.forEach((review) => {
    averages.education += review.education;
    averages.extraActivities += review.extraActivities;
    averages.infrastructure += review.infrastructure;
    averages.location += review.location;
    averages.overallQuality += review.overallQuality;
  });

  const aggregateRatings = {
    education: averages.education / reviews.length,
    extraActivities: averages.extraActivities / reviews.length,
    infrastructure: averages.infrastructure / reviews.length,
    location: averages.location / reviews.length,
    overallQuality: averages.overallQuality / reviews.length,
  };
  return aggregateRatings;
}

export function getAverageMajorReviewRatings(reviews: MajorReview[]) {
  const averages = {
    overallQuality: 0,
    education: 0,
    lifeBalance: 0,
  };

  reviews.forEach((review) => {
    averages.education += review.education;
    averages.overallQuality += review.overallQuality;
    averages.lifeBalance += review.lifeBalance;
  });

  const aggregateRatings = {
    education: averages.education / reviews.length,
    overallQuality: averages.overallQuality / reviews.length,
    lifeBalance: averages.lifeBalance / reviews.length,
  };
  return aggregateRatings;
}
