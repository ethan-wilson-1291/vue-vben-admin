import { computed } from 'vue';

import { useShopStore } from '#/store';

/**
 * Composable that returns reactive class/style bindings to gate content
 * behind the subscription paywall. When the shop is on a free subscription,
 * the content is blurred and non-interactive.
 */
export function useSubscriptionGate() {
  const shopStore = useShopStore();

  const gateClass = computed(() => ({
    'pointer-events-none select-none blur-sm': shopStore.isFreeSubscription,
  }));

  const gateStyle = computed(() =>
    shopStore.isFreeSubscription
      ? ({
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
        } as const)
      : undefined,
  );

  return { gateClass, gateStyle };
}
