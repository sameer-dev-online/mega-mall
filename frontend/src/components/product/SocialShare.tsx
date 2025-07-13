'use client';

import React from 'react';
import { Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface SocialShareProps {
  product: Product;
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ product, url }) => {
  const shareText = `Check out this amazing product: ${product.title}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform];
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="w-10 h-10"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('twitter')}
        className="w-10 h-10"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('linkedin')}
        className="w-10 h-10"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('whatsapp')}
        className="w-10 h-10"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNativeShare}
        className="w-10 h-10"
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
