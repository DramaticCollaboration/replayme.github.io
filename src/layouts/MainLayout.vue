<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-grey-9'">
      <q-toolbar>
        <q-toolbar-title class="row items-center no-wrap">
          <!-- 로고 크기 증가 및 스타일링 -->
          <div class="logo-container">
            <q-avatar square size="42px" class="q-mr-sm">
              <q-img
                :src="$q.dark.isActive ? '/images/logo-dark.png' : '/images/logo-light.png'"
                spinner-color="primary"
                class="logo-image"
              />
            </q-avatar>
            <span class="text-h5 logo-text">
              Replay<span :class="$q.dark.isActive ? 'text-accent' : 'text-white'">Me</span>
            </span>
          </div>
        </q-toolbar-title>

        <!-- 다크모드 메뉴 -->
        <q-btn flat round>
          <q-icon :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'" />

          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="setTheme('auto')">
                <q-item-section avatar>
                  <q-icon name="settings_suggest" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>자동</q-item-label>
                  <q-item-label caption>시스템 설정 사용</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check" v-if="currentTheme === 'auto'" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="setTheme('light')">
                <q-item-section avatar>
                  <q-icon name="light_mode" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>라이트 모드</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check" v-if="currentTheme === 'light'" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="setTheme('dark')">
                <q-item-section avatar>
                  <q-icon name="dark_mode" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>다크 모드</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check" v-if="currentTheme === 'dark'" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>

    </q-header>

    <q-page-container>
      <div class="content-container">
        <router-view />
      </div>
    </q-page-container>

    <q-footer class="bg-grey-1 text-grey-9" v-if="!isAuthPage">
      <q-tabs align="justify" dense>
        <q-route-tab icon="home" label="홈" name="index" to="/index  "/>
        <q-route-tab icon="search" label="탐색" name="explore" to="/explore"/>
        <q-route-tab icon="cloud_upload" label="업로드"  name="upload" to="/upload"/>
        <q-route-tab icon="notifications" label="알림" name="notification" to="/notification"/>
        <q-route-tab icon="person" label="프로필"  name="profile" to="/profile"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const $q = useQuasar();

const currentTheme = ref('auto');

// 테마 설정 함수
const setTheme = (theme: 'auto' | 'light' | 'dark') => {
  currentTheme.value = theme;

  if (theme === 'auto') {
    // 시스템 설정 감지
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    $q.dark.set(prefersDark.matches);

    // 시스템 설정 변경 감지
    prefersDark.addEventListener('change', (e) => {
      $q.dark.set(e.matches);
    });
  } else {
    $q.dark.set(theme === 'dark');
  }

  // 설정 저장
  localStorage.setItem('theme', theme);
};

const isAuthPage = computed(() => {
  // Add any auth-related routes here
  const authRoutes = ['login', 'register'];
  return authRoutes.includes(route.name as string);
});


// 저장된 테마 설정 복원
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as 'auto' | 'light' | 'dark' | null;
  if (savedTheme) {
    currentTheme.value = savedTheme;
    setTheme(savedTheme);
  } else {
    setTheme('auto');
  }
});
</script>

<style scoped>
/* 최대 너비 제한을 위한 공통 컨테이너 스타일 */
.content-container {
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

/* 헤더의 컨테이너 특수 스타일 */
.q-toolbar .content-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 100%;
}


/* 다크모드 전환 애니메이션 */
.q-header,
.q-footer,
.q-toolbar-title {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 로고 스타일 */
.q-avatar {
  width: 32px;
  height: 32px;
}

/* 다크모드에서의 강조색 */
.text-accent {
  color: #FFC107;
}

/* 라이트모드에서 로고 텍스트 색상 */
.text-white {
  color: white;
}

/* 테마 메뉴 스타일 */
.q-menu {
  border-radius: 8px;
}

.q-item {
  min-height: 48px;
}

/* 로고 컨테이너 스타일링 */
.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

/* 로고 이미지 스타일링 */
.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 로고 텍스트 스타일링 */
.logo-text {
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* 다크모드 전환 애니메이션 */
.q-header,
.q-footer,
.logo-container {
  transition: all 0.3s ease;
}

/* 반응형 디자인 */
@media (max-width: 599px) {
  .logo-text {
    font-size: 1.5rem;
  }
  .q-avatar {
    size: 36px;
  }
}

</style>
