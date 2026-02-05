import { Schema, model } from 'mongoose';

export enum ReviewStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    status: { type: String, enum: Object.values(ReviewStatus), default: ReviewStatus.Pending }
  },
  { timestamps: true }
);

export const Review = model('Review', ReviewSchema);
