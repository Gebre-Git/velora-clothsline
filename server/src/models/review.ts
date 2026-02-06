import { Schema, model } from 'mongoose';

export enum ReviewStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

const ReviewSchema = new Schema(
  {
    customerName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    status: { type: String, enum: Object.values(ReviewStatus), default: ReviewStatus.Pending }
  },
  { timestamps: true }
);

export const Review = model('Review', ReviewSchema);
