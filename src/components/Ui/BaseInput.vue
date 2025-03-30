<template>
  <div class="base-input">
    <div class="input-wrapper">
      <input
        :type="type"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'is-disabled': disabled }"
        class="input-field"
      />
      <SearchIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

interface Props {
  modelValue: string
  placeholder?: string
  type?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.base-input {
  width: 100%;

  .input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    right: spacing('md');
    color: color('text', 'secondary');
    pointer-events: none;
  }

  .input-field {
    width: 100%;
    height: 40px;
    padding: spacing('md') spacing('xl') spacing('md') spacing('md');
    border: 1px solid color('border', 'light');
    border-radius: border-radius('sm');
    font-size: font-size('sm');
    font-family: inherit;
    background: color('background', 'primary');
    color: color('text', 'primary');
    transition: all 0.2s ease;

    &::placeholder {
      color: color('text', 'placeholder');
    }

    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }

    &.is-disabled {
      background: color('background', 'disabled');
      cursor: not-allowed;
    }
  }
}
</style>
