import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, ExternalLink, Inbox, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ReviewStars } from "@/components/review-stars";
import { SiteShell } from "@/components/site-shell";
import { CustomTimeAgo } from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ItemType } from "@/lib/review-core";
import type { PendingReviewCommentRecord } from "@/lib/reviews";
import {
  getPendingReviewCommentsServerFn,
  moderateReviewCommentServerFn,
} from "@/lib/reviews-actions";

const adminReviewLoader = async () => {
  const result = await getPendingReviewCommentsServerFn();
  if (!result.ok) {
    throw notFound();
  }

  return {
    comments: result.comments,
  };
};

export const Route = createFileRoute("/admin")({
  loader: adminReviewLoader,
  head: () => ({
    meta: [
      { title: "Admin - SoulFire" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function getItemTypeLabel(itemType: ItemType) {
  switch (itemType) {
    case "account":
      return "Account";
    case "proxy":
      return "Proxy";
    case "resource":
      return "Resource";
  }
}

function getItemPath(itemType: ItemType, itemSlug: string) {
  switch (itemType) {
    case "account":
      return `/get-accounts/${itemSlug}`;
    case "proxy":
      return `/get-proxies/${itemSlug}`;
    case "resource":
      return `/resources/${itemSlug}`;
  }
}

function AdminPage() {
  const data = Route.useLoaderData();
  const [comments, setComments] = useState(data.comments);
  const [pendingReviewId, setPendingReviewId] = useState<string | null>(null);

  const moderateComment = async (
    review: PendingReviewCommentRecord,
    commentStatus: "approved" | "rejected",
  ) => {
    setPendingReviewId(review.id);

    try {
      const result = await moderateReviewCommentServerFn({
        data: {
          reviewId: review.id,
          commentStatus,
        },
      });

      if (!result.ok) {
        toast("Not allowed", {
          description: "Your account does not have admin access.",
        });
        return;
      }

      setComments((current) =>
        current.filter((comment) => comment.id !== review.id),
      );
      toast(
        commentStatus === "approved" ? "Comment approved" : "Comment rejected",
      );
    } finally {
      setPendingReviewId(null);
    }
  };

  return (
    <SiteShell>
      <main className="mx-auto flex w-full max-w-(--fd-layout-width) flex-col gap-6 px-4 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Review moderation</h1>
          <p className="text-sm text-muted-foreground">
            Pending written comments are hidden from public review text until
            approved.
          </p>
        </div>

        {comments.length > 0 ? (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="gap-5">
                <CardHeader className="gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="lg">
                        {comment.authorImage ? (
                          <AvatarImage
                            src={comment.authorImage}
                            alt={comment.authorName}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitial(comment.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">
                          {comment.authorName}
                        </CardTitle>
                        {comment.authorEmail ? (
                          <p className="truncate text-sm text-muted-foreground">
                            {comment.authorEmail}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {getItemTypeLabel(comment.itemType)}
                      </Badge>
                      <a
                        href={getItemPath(comment.itemType, comment.itemSlug)}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {comment.itemSlug}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <ReviewStars value={comment.rating} size="sm" />
                    <span className="tabular-nums">
                      {comment.rating.toFixed(1)}
                    </span>
                    <span>·</span>
                    <CustomTimeAgo date={comment.createdAt} />
                  </div>
                  <p className="rounded-md border bg-muted/20 p-3 text-sm leading-6">
                    {comment.body}
                  </p>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button
                    type="button"
                    onClick={() => moderateComment(comment, "approved")}
                    disabled={pendingReviewId === comment.id}
                  >
                    <Check data-icon="inline-start" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => moderateComment(comment, "rejected")}
                    disabled={pendingReviewId === comment.id}
                  >
                    <X data-icon="inline-start" />
                    Reject
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-start gap-3 py-6 text-sm text-muted-foreground">
              <Inbox className="size-5" />
              No pending comments.
            </CardContent>
          </Card>
        )}
      </main>
    </SiteShell>
  );
}
