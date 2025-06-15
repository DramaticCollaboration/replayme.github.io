<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="width: 400px; max-width: 90vw;">
      <div class="text-h6 text-center q-mb-md">🔓 로그인</div>
      <q-form @submit.prevent="handleLogin" class="q-gutter-md">
        <q-input
          filled
          v-model="email"
          type="email"
          label="이메일"
          :rules="[val => !!val || '이메일을 입력하세요.']"
        />
        <q-input
          filled
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="비밀번호"
          :rules="[val => !!val || '비밀번호를 입력하세요.']"
        >
          <template #append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" @click="showPassword = !showPassword" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn type="submit" label="로그인" color="primary" unelevated class="full-width" />
        <q-separator />
        <div class="q-gutter-y-sm">
          <q-btn
            flat
            class="full-width google-btn"
            @click="handleSocialLogin('google')"
          >
            <q-avatar size="24px" class="q-mr-sm">
              <img src="https://www.google.com/favicon.ico" />
            </q-avatar>
            Google로 계속하기
          </q-btn>

          <q-btn
            flat
            class="full-width apple-btn"
            @click="handleSocialLogin('apple')"
          >
            <q-avatar size="24px" class="q-mr-sm">
              <q-icon name="fab fa-apple" />
            </q-avatar>
            Apple로 계속하기
          </q-btn>

          <q-btn
            flat
            class="full-width naver-btn"
            @click="handleSocialLogin('naver')"
          >
            <q-avatar size="24px" class="q-mr-sm">
              <img src="https://www.naver.com/favicon.ico" />
            </q-avatar>
            네이버로 계속하기
          </q-btn>

          <q-btn
            flat
            class="full-width kakao-btn"
            @click="handleSocialLogin('kakao')"
          >
            <q-avatar size="24px" class="q-mr-sm">
              <img src="https://www.kakaocorp.com/page/favicon.ico"/>
            </q-avatar>
            카카오로 계속하기
          </q-btn>
        </div>

        <div class="text-caption text-center q-mt-sm">
          계정이 없으신가요? <router-link to="/register">회원가입</router-link>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const email: Ref<string> = ref('');
const password: Ref<string> = ref('');
const showPassword: Ref<boolean> = ref(false);

const handleLogin = async (): Promise<void> => {
  console.log('로그인 정보:', { email: email.value, password: password.value });
  await router.push('/index');
};
const handleSocialLogin = async (provider: 'google' | 'apple' | 'naver' | 'kakao'):  Promise<void> => {
  // Implement social login logic here
  console.log(`${provider} 로그인 시도`);
  await router.push('/index');
};

</script>


<style scoped>
.google-btn {
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
}

.apple-btn {
  background-color: black;
  color: white;
}

.naver-btn {
  background-color: #03C75A;
  color: white;
}

.kakao-btn {
  background-color: #FEE500;
  color: #000000;
}

/* Hover effects */
.google-btn:hover {
  background-color: #f5f5f5;
}

.apple-btn:hover {
  background-color: #333333;
}

.naver-btn:hover {
  background-color: #02b150;
}

.kakao-btn:hover {
  background-color: #fdd835;
}
</style>
