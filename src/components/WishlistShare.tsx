import { Share2, Link, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface WishlistShareProps {
  favoriteIds: string[];
}

const WishlistShare = ({ favoriteIds }: WishlistShareProps) => {
  const [copied, setCopied] = useState(false);

  if (favoriteIds.length === 0) return null;

  const shareUrl = `${window.location.origin}/favorites?shared=${btoa(JSON.stringify(favoriteIds))}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this link with friends" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Bike Wishlist — BikeMan",
        text: `Check out my ${favoriteIds.length} favorite bikes on BikeMan!`,
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleNativeShare} className="rounded-xl text-xs h-8">
        <Share2 className="h-3 w-3 mr-1" />
        Share
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCopy} className="rounded-xl text-xs h-8">
        {copied ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
    </div>
  );
};

export default WishlistShare;
