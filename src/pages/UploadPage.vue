<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">🎥 영상 업로드 및 분석</div>

    <q-form @submit.prevent="onSubmit">
      <div class="row justify-center">
        <div class="col-12 col-md-8 col-lg-6">
          <!-- 1. 파일 업로드 -->
          <q-uploader
            url=""
            :auto-upload="false"
            label="동영상을 업로드하세요"
            accept="video/mp4, video/quicktime"
            class="q-mb-md full-width"
            style="max-width: 100%"
            flat
            bordered
          >
            <template v-slot:header>
              <div class="row no-wrap items-center q-pa-sm w-100">
                <div class="col text-center">
                  <div class="text-weight-medium">
                    동영상을 드래그하여 업로드하세요
                  </div>
                  <div class="text-caption text-grey">
                    또는 클릭하여 파일을 선택하세요
                  </div>
                </div>
              </div>
            </template>
          </q-uploader>
        </div>
      </div>


      <!-- 2. 분석 옵션 선택: AI / 슬로우모션만 / 수동 [1, 2, 4-6, 9, 10, 12, 14, 15, 17] -->
      <q-option-group
        v-model="analysisOption"
        :options="[
          { label: 'AI 자동 분석', value: 'ai' },
          { label: '슬로우모션만', value: 'slow' },
          { label: '수동 분석', value: 'manual' }
        ]"
        type="radio"
        inline
        label="분석 옵션 선택"
        class="q-mb-md"
      />

      <!-- 3. 구간 선택 (수동 또는 AI 분석일 때만 표시) [1, 2, 4-10, 12, 18, 19] -->
      <div v-if="analysisOption !== 'slow'" class="q-mb-md">
        <q-slider
          v-model="range"
          :min="0"
          :max="100"
          :step="1"
          label-always
          :marker-labels="[{ value: 0 }, { value: 50 }, { value: 100 }]"
        />
      </div>

      <!-- 4. 영상 제목 / 설명 / 해시태그 입력 [1, 2, 4-10, 12, 19, 20] -->
      <q-input v-model="title" label="영상 제목" class="q-mb-sm" />
      <q-input v-model="description" type="textarea" label="설명" class="q-mb-sm" />
      <q-input v-model="hashtag" label="#해시태그 (예: #야구 #스윙)" class="q-mb-md" />

      <!-- 5. 종목 선택 [4, 7, 12, 20-26] -->
      <q-select
        v-model="sport"
        :options="['야구', '골프', '검도', '탁구', '축구', '농구']"
        label="종목 선택"
        class="q-mb-lg"
        clearable
      />

      <!-- 6. 제출 버튼 [20, 23] -->
      <q-btn label="업로드 및 분석 시작" type="submit" color="primary" unelevated class="full-width" />
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 📄 반응형 상태 변수와 타입 정의
const analysisOption = ref<string>('ai'); // 분석 옵션 ('ai', 'slow', 'manual') [15, 27]
const range = ref<number>(28); // 분석 구간 범위 (시작, 끝) [15, 30]
const title = ref<string>(''); // 영상 제목 [15, 30]
const description = ref<string>(''); // 영상 설명 [15, 30]
const hashtag = ref<string>(''); // 해시태그 [15, 30]
const sport = ref<string | null>(null); // 선택된 스포츠 종목 [15, 23]


/**
 * @function onSubmit
 * 폼 제출 시 호출되는 함수.
 * 입력된 정보를 기반으로 영상 분석 요청을 서버로 보냅니다. [19, 31]
 */
const onSubmit = (): void => {
  console.log('--- 영상 업로드 및 분석 정보 ---');
  console.log('분석 옵션:', analysisOption.value);
  if (analysisOption.value !== 'slow') {
    console.log('분석 구간:', range.value);
  }
  console.log('영상 제목:', title.value);
  console.log('설명:', description.value);
  console.log('해시태그:', hashtag.value);
  console.log('종목:', sport.value);
  console.log('-----------------------------');

  // 실제 서비스에서는 이 정보를 백엔드 API로 전송하여 영상 분석 및 게시 프로세스를 시작합니다.
  // 예: uploadVideo({ analysisOption: analysisOption.value, title: title.value, ... });
  alert('영상 업로드 및 분석 요청이 전송되었습니다. (콘솔 확인)');
  // 성공 후 폼 초기화 또는 다른 페이지로 이동
  // analysisOption.value = 'ai';
  // range.value = [28, 29];
  // title.value = '';
  // description.value = '';
  // hashtag.value = '';
  // sport.value = null;
};
</script>


<style scoped>
/* 업로더 스타일링 */
.q-uploader {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 업로더 헤더 영역 스타일링 */
:deep(.q-uploader__header) {
  background-color: transparent;
  border-bottom: 1px dashed #ddd;
}

/* 드래그 영역 스타일링 */
:deep(.q-uploader__input) {
  min-height: 150px;
}

/* 반응형 패딩 */
@media (max-width: 599px) {
  .q-page {
    padding: 16px;
  }
}

@media (min-width: 600px) {
  .q-page {
    padding: 24px;
  }
}
</style>
