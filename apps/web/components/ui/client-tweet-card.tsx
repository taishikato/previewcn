"use client";

import { useEffect, type ReactNode } from "react";
import { useTweet } from "react-tweet";

import {
  MagicTweet,
  TweetNotFound,
  TweetSkeleton,
} from "@/components/ui/tweet-card";

type ClientTweetCardProps = {
  id?: string;
  className?: string;
  fallback?: ReactNode;
  onError?: (error: unknown) => void;
};

export function ClientTweetCard({
  id,
  className,
  fallback = <TweetSkeleton />,
  onError,
}: ClientTweetCardProps) {
  const { data, error, isLoading } = useTweet(id);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (error || !data) {
    return <TweetNotFound className={className} />;
  }

  return <MagicTweet tweet={data} className={className} />;
}
