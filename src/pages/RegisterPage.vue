<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="width: 400px; max-width: 90vw;">
      <div class="text-h6 text-center q-mb-md">📝 회원가입</div>
      <q-form @submit.prevent="handleRegister" class="q-gutter-md">
        <q-input filled v-model="name" label="이름" :rules="[val => !!val || '이름을 입력하세요.']" />
        <q-input filled v-model="email" label="이메일" type="email" :rules="[(val: string) => !!val || '이메일을 입력하세요.']" />
        <q-input
          filled
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="비밀번호"
          :rules="[
          (val: string) => !!val || '비밀번호를 입력하세요.',
          (val: string) => val.length >= 6 || '비밀번호는 최소 6자 이상이어야 합니다.'
        ]"
        >
          <template #append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" @click="showPassword = !showPassword" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input
          filled
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          label="비밀번호 확인"
          :rules="[(val: string) => val === password || '비밀번호가 일치하지 않습니다.']"
        />
        <q-select
          filled
          v-model="sports"
          :options="['야구', '골프', '검도', '탁구']"
          multiple
          label="관심 종목 선택"
          :rules="[(val: string) => val.length > 0 || '관심 종목을 1개 이상 선택하세요.']"
        />
        <q-checkbox v-model="agree" label="서비스 이용약관에 동의합니다." :rules="[(val: string) => val || '이용약관에 동의해야 합니다.']" />
        <q-btn type="submit" label="가입 완료" color="primary" unelevated class="full-width" />
        <div class="text-caption text-center q-mt-sm">
          이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

const name: Ref<string> = ref('');
const email: Ref<string> = ref('');
const password: Ref<string> = ref('');
const confirmPassword: Ref<string> = ref('');
const showPassword: Ref<boolean> = ref(false);
const sports: Ref<string[]> = ref([]);
const agree: Ref<boolean> = ref(false);

const handleRegister = (): void => {
  // Quasar의 q-form에 내장된 유효성 검사를 활용할 수 있지만, 여기서는 추가적인 JS 검사를 예시합니다.
  if (!agree.value) {
    alert('이용약관에 동의해야 합니다.'); // Quasar notify 또는 QDialog로 대체 가능
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  if (sports.value.length === 0) {
    alert('관심 종목을 1개 이상 선택해야 합니다.');
    return;
  }

  console.log('회원가입 정보:', {
    name: name.value,
    email: email.value,
    password: password.value, // 실제 앱에서는 비밀번호를 직접 로깅하지 않습니다.
    sports: sports.value
  });
  // 실제 회원가입 API 호출 로직은 여기에 구현됩니다.
  // 성공 시 로그인 페이지 또는 홈 페이지로 리다이렉트
};
</script>
