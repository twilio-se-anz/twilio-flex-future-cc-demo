import React, { useEffect, useState } from 'react';
import { Box, Stack, Badge, SkeletonLoader } from '@twilio-paste/core';

import { SegmentTraits } from '../types/Segment/SegmentTraits';
import { KnownTraits } from '../../../types/segment/KnownTraits';

type TraitTagsProps = {
  traits: SegmentTraits;
  loading: boolean;
};

type TraitBadges = { value: string; variant: any };

const makeBadges = (traits: any) => {
  const badges: TraitBadges[] = [];

  console.log(`Evaluating traits`, traits);

  // Known Traits
  KnownTraits.forEach((item) => {
    console.log(`Evaluating know trait against ${item.key} `);
    if (traits && traits.hasOwnProperty(item.key)) {
      if (item.display_value == true) {
        badges.push({
          value: item.label + ': ' + traits[item.key],
          variant: item.variant,
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (item.onlyIfTrue === true && traits[item.key] === false) {
          // Skip
        } else {
          badges.push({ value: item.label, variant: item.variant });
        }
      }
    }
  });

  if (traits) {
    Object.keys(traits).forEach((key) => {
      if (key.startsWith('inferred')) {
        let traitName: string = key;
        traitName = traitName.replace(/^inferred/, '').replace(/[_-]/g, ' ');
        traitName = traitName.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase(),
        );
        badges.push({ value: `${traitName}: ${traits[key]}`, variant: 'neutral' });
      }
    });
  }
  // Interred

  console.log(`Total badges (traits) to display ${badges.length} `);
  return badges;
};

const TraitTags = ({ loading, traits }: TraitTagsProps) => {
  const [traitBadges, setTraitBadges] = useState<TraitBadges[]>();

  useEffect(() => {
    setTraitBadges(makeBadges(traits));
  }, [traits]);

  if (loading)
    return (
      <Stack orientation={'vertical'} spacing={'space70'}>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </Stack>
    );

  if (!traitBadges || traitBadges.length === 0) return <>No traits found</>;
  return (
    <Box display="flex" columnGap="space40" rowGap="space60" flexWrap="wrap">
      {traitBadges?.map((badge, idx: number) => (
        <Badge as="span" variant={badge.variant} key={idx}>
          {badge.value}
        </Badge>
      ))}
    </Box>
  );
};

export default TraitTags;
