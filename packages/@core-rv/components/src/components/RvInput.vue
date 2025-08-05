<script setup lang="ts">
export interface InputProps {
  disabled?: boolean;
  error?: string;
  label?: string;
  modelValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: 'email' | 'password' | 'text';
}

withDefaults(defineProps<InputProps>(), {
  disabled: false,
  error: '',
  label: '',
  modelValue: '',
  placeholder: '',
  required: false,
  type: 'text',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="rv-input">
    <label
      v-if="label"
      class="rv-input__label"
      :class="{ 'rv-input__label--required': required }"
    >
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="rv-input__field"
      :class="{
        'rv-input__field--error': error,
        'rv-input__field--disabled': disabled,
      }"
      @input="handleInput"
    />
    <div v-if="error" class="rv-input__error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.rv-input {
  @apply space-y-1;
}

.rv-input__label {
  @apply block text-sm font-medium text-gray-700;
}

.rv-input__label--required::after {
  @apply text-red-500;

  content: ' *';
}

.rv-input__field {
  @apply block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500;
}

.rv-input__field--error {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

.rv-input__field--disabled {
  @apply cursor-not-allowed bg-gray-50 opacity-50;
}

.rv-input__error {
  @apply text-sm text-red-600;
}
</style>
