<script setup lang="ts">
/**
 * 与《组件封装的思考》一文中弹窗逻辑对齐的演示版：无 Element Plus、无真实接口。
 * 数据为本地模拟，schoolId 等由 mock 层忽略或写死。
 */
export type TeacherItem = {
  tenantUserId: string
  userName?: string
  userPhone?: string
  schoolName?: string
  /** 演示：用于科目筛选 */
  subjectId?: string
}

type SubjectOption = {
  id: string
  name: string
}

const MOCK_SUBJECTS: SubjectOption[] = [
  { id: 'sub-1', name: '语文' },
  { id: 'sub-2', name: '数学' },
  { id: 'sub-3', name: '英语' },
]

const MOCK_TEACHERS: TeacherItem[] = [
  { tenantUserId: 't1', userName: '张三', userPhone: '13800001001', schoolName: '第一中学', subjectId: 'sub-1' },
  { tenantUserId: 't2', userName: '李四', userPhone: '13800001002', schoolName: '第一中学', subjectId: 'sub-2' },
  { tenantUserId: 't3', userName: '王五', userPhone: '13800001003', schoolName: '第二中学', subjectId: 'sub-2' },
  { tenantUserId: 't4', userName: '赵六', userPhone: '13900001004', schoolName: '第一中学', subjectId: 'sub-3' },
  { tenantUserId: 't5', userName: '钱七', userPhone: '13700001005', schoolName: '实验中学', subjectId: 'sub-1' },
]

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

const visible = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)

const context = ref<unknown>(null)

let confirmCallback: ((selected: TeacherItem[], ctx: unknown) => void) | null = null

const subjectFilter = ref('')
const searchKeyword = ref('')

const subjectOptions = ref<SubjectOption[]>([])

async function fetchSubjectList() {
  await delay(120)
  subjectOptions.value = MOCK_SUBJECTS
}

const allTeachers = ref<TeacherItem[]>([])
const selectedTeachers = ref<TeacherItem[]>([])
const rightSelection = ref<TeacherItem[]>([])
const tip = ref('')

const selectedIds = computed(() => new Set(selectedTeachers.value.map(t => t.tenantUserId)))

function checkSelectable(row: TeacherItem) {
  return !selectedIds.value.has(row.tenantUserId)
}

function toggleLeftRow(row: TeacherItem, checked: boolean) {
  if (!checked) {
    return
  }
  if (selectedIds.value.has(row.tenantUserId)) {
    return
  }
  selectedTeachers.value.push({ ...row })
}

function handleRightSelectionChange(e: Event, row: TeacherItem) {
  const input = e.target as HTMLInputElement
  const checked = input.checked
  if (checked) {
    if (!rightSelection.value.some(t => t.tenantUserId === row.tenantUserId)) {
      rightSelection.value.push(row)
    }
  }
  else {
    rightSelection.value = rightSelection.value.filter(t => t.tenantUserId !== row.tenantUserId)
  }
}

function handleRemove(row: TeacherItem) {
  const index = selectedTeachers.value.findIndex(t => t.tenantUserId === row.tenantUserId)
  if (index > -1) {
    selectedTeachers.value.splice(index, 1)
  }
  rightSelection.value = rightSelection.value.filter(t => t.tenantUserId !== row.tenantUserId)
}

function handleBatchRemove() {
  if (rightSelection.value.length === 0) {
    tip.value = '请先选择要删除的教师'
    window.setTimeout(() => (tip.value = ''), 2500)
    return
  }
  const removeIds = new Set(rightSelection.value.map(t => t.tenantUserId))
  selectedTeachers.value = selectedTeachers.value.filter(t => !removeIds.has(t.tenantUserId))
  rightSelection.value = []
}

function handleCancel() {
  closeDialog()
}

function handleConfirm() {
  if (confirmCallback) {
    confirmCallback([...selectedTeachers.value], context.value)
  }
  closeDialog()
}

interface OpenOptions {
  defaultSelected?: TeacherItem[]
  context?: unknown
  onConfirm?: (selected: TeacherItem[], ctx: unknown) => void
}

async function open(options: OpenOptions = {}) {
  const { defaultSelected = [], context: ctx = null, onConfirm } = options

  context.value = ctx
  confirmCallback = onConfirm ?? null
  selectedTeachers.value = defaultSelected.map(t => ({ ...t }))
  rightSelection.value = []

  visible.value = true
  await nextTick()
  dialogRef.value?.showModal()

  await fetchAllTeachers()
  await fetchSubjectList()
}

function closeDialog() {
  visible.value = false
  dialogRef.value?.close()
}

function onDialogClosed() {
  visible.value = false
  searchKeyword.value = ''
  subjectFilter.value = ''
  rightSelection.value = []
  selectedTeachers.value = []
  allTeachers.value = []
  subjectOptions.value = []
  context.value = null
  confirmCallback = null
}

defineExpose({
  open,
})

async function fetchAllTeachers() {
  await delay(150)
  let list = MOCK_TEACHERS.map(t => ({ ...t }))
  if (subjectFilter.value) {
    list = list.filter(t => t.subjectId === subjectFilter.value)
  }
  const kw = searchKeyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      t =>
        t.userName?.toLowerCase().includes(kw)
        || t.userPhone?.includes(kw)
        || t.schoolName?.toLowerCase().includes(kw),
    )
  }
  allTeachers.value = list
}

watch([subjectFilter, searchKeyword], () => {
  if (visible.value) {
    fetchAllTeachers()
  }
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="grading-demo-dialog w-[min(1000px,calc(100vw-2rem))] max-h-[min(90vh,800px)] border border-zinc-200 rounded-lg bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    @close="onDialogClosed"
  >
    <div class="border-b border-zinc-200 px-4 py-3 text-lg font-semibold dark:border-zinc-700">
      设置阅卷教师（演示 · 模拟数据）
    </div>

    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-5" style="min-height: 420px;">
      <!-- 左侧 -->
      <div class="min-h-0 flex flex-col gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <label class="sr-only">
            科目
          </label>
          <select
            v-model="subjectFilter"
            class="max-w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          >
            <option value="">
              科目（全部）
            </option>
            <option v-for="s in subjectOptions" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="姓名 / 手机 / 学校"
            class="min-w-[12rem] flex-1 rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          >
        </div>
        <div class="min-h-0 flex-1 overflow-auto rounded border border-zinc-200 dark:border-zinc-700">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th class="w-10 border-b border-zinc-200 p-2 dark:border-zinc-600" />
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  姓名
                </th>
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  联系方式
                </th>
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  学校
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in allTeachers" :key="row.tenantUserId" class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="p-2 align-middle">
                  <input
                    :key="`${row.tenantUserId}-${selectedIds.has(row.tenantUserId)}`"
                    type="checkbox"
                    :disabled="!checkSelectable(row)"
                    :aria-label="`选择 ${row.userName ?? row.tenantUserId}`"
                    @change="(e: { target: HTMLInputElement }) => toggleLeftRow(row, (e.target as HTMLInputElement).checked)"
                  >
                </td>
                <td class="p-2">
                  {{ row.userName ?? '—' }}
                </td>
                <td class="p-2">
                  {{ row.userPhone ?? '—' }}
                </td>
                <td class="p-2">
                  {{ row.schoolName ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="!allTeachers.length" class="p-4 text-center text-zinc-500">
            暂无数据（可调整筛选条件）
          </p>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="min-h-0 flex flex-col gap-2">
        <div class="flex h-8 items-center font-semibold text-blue-600 dark:text-blue-400">
          <span>已选教师</span>
          <button
            type="button"
            class="ml-auto text-sm font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
            @click="handleBatchRemove"
          >
            删除选中教师
          </button>
        </div>
        <div class="min-h-0 flex-1 overflow-auto rounded border border-zinc-200 dark:border-zinc-700">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th class="w-10 border-b border-zinc-200 p-2 dark:border-zinc-600" />
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  姓名
                </th>
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  联系方式
                </th>
                <th class="border-b border-zinc-200 p-2 dark:border-zinc-600">
                  学校
                </th>
                <th class="w-14 border-b border-zinc-200 p-2 text-center dark:border-zinc-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in selectedTeachers" :key="row.tenantUserId" class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="p-2 align-middle">
                  <input
                    type="checkbox"
                    :checked="rightSelection.some(t => t.tenantUserId === row.tenantUserId)"
                    :aria-label="`已选列表中选择 ${row.userName ?? row.tenantUserId}`"
                    @change="handleRightSelectionChange($event, row)"
                  >
                </td>
                <td class="p-2">
                  {{ row.userName ?? '—' }}
                </td>
                <td class="p-2">
                  {{ row.userPhone ?? '—' }}
                </td>
                <td class="p-2">
                  {{ row.schoolName ?? '—' }}
                </td>
                <td class="p-2 text-center">
                  <button
                    type="button"
                    class="text-sm text-red-600 hover:underline dark:text-red-400"
                    @click="handleRemove(row)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="!selectedTeachers.length" class="p-4 text-center text-zinc-500">
            尚未选择教师
          </p>
        </div>
      </div>
    </div>

    <p v-if="tip" class="px-4 pb-2 text-sm text-amber-700 dark:text-amber-400">
      {{ tip }}
    </p>

    <div class="flex justify-end gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
      <button
        type="button"
        class="rounded border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        @click="handleCancel"
      >
        取消
      </button>
      <button
        type="button"
        class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        @click="handleConfirm"
      >
        确定
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.grading-demo-dialog::backdrop {
  background: rgb(0 0 0 / 0.45);
}
</style>
