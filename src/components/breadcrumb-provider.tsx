"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

const MAX_VISIBLE_SEGMENTS = 3;

function formatSegmentName(segment: string) {
  return segment.replaceAll("-", " ");
}

export function BreadcrumbProvider() {
  const currentPath = usePathname();

  const segments = useMemo(
    () => currentPath.split("/").filter(Boolean),
    [currentPath],
  );

  const breadcrumbs = useMemo(() => {
    if (!segments.length)
      return {
        rootSegment: null,
        visibleSegments: [],
        hasHiddenSegments: false,
      };

    const rootSegment = {
      name: formatSegmentName(segments[0]),
      href: `/${segments[0]}`,
    };
    const hasHiddenSegments = segments.length > MAX_VISIBLE_SEGMENTS + 1;

    const visibleSegments = (
      hasHiddenSegments
        ? segments.slice(-MAX_VISIBLE_SEGMENTS)
        : segments.slice(1)
    ).map((segment, index) => {
      const startIndex = hasHiddenSegments
        ? segments.length - MAX_VISIBLE_SEGMENTS + index
        : index + 1;
      return {
        name: formatSegmentName(segment),
        href: `/${segments.slice(0, startIndex + 1).join("/")}`,
      };
    });

    return { rootSegment, visibleSegments, hasHiddenSegments };
  }, [segments]);

  if (!breadcrumbs.rootSegment) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={breadcrumbs.rootSegment.href}
            className={cn(
              "capitalize",
              breadcrumbs.rootSegment.href === currentPath &&
                "pointer-events-none font-bold text-primary",
            )}
          >
            {breadcrumbs.rootSegment.name}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 1 && <BreadcrumbSeparator />}

        {breadcrumbs.hasHiddenSegments && (
          <>
            <BreadcrumbEllipsis />
            <BreadcrumbSeparator />
          </>
        )}

        {breadcrumbs.visibleSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={segment.href}
                className={cn(
                  "capitalize",
                  segment.href === currentPath &&
                    "pointer-events-none font-bold text-primary",
                )}
              >
                {segment.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbs.visibleSegments.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
