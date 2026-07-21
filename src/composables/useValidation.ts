import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

export function useLoginValidation(credentials: any) {
  const rules = {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };

  const v$ = useVuelidate(rules, credentials);

  const errorMessages = computed(() => ({
    email: v$.value.email.$errors.map(e => e.$message),
    password: v$.value.password.$errors.map(e => e.$message),
  }));

  return { v$, errorMessages };
}
