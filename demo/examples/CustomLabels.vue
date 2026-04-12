<script setup lang="ts">
import { ref } from "vue";
import { Treeselect } from "vue3-treeselect";
import {
  customKeyOptions,
  optionsWithIcons,
  optionsWithDetails,
} from "../data";

// 三个示例的值
const normalizerValue = ref<string | null>(null);
const optionLabelValue = ref<string | null>(null);
const valueLabelValue = ref<string | null>(null);

// normalizer 函数：将自定义键名映射为标准格式
// 将 key -> id, name -> label, subItems -> children
const normalizer = (node: any) => {
  return {
    id: node.key,
    label: node.name,
    children: node.subItems,
  };
};
</script>

<template>
  <div class="example">
    <h2 class="example-title">Custom Labels</h2>
    <p class="example-description">
      演示三种自定义标签的方式：自定义字段映射 (normalizer)、自定义选项标签
      (option-label slot)、自定义值标签 (value-label slot)。
    </p>

    <!-- 1. Customize Key Names - 使用 normalizer -->
    <div class="demo-section">
      <h3 class="section-title">1. Customize Key Names</h3>
      <p class="section-description">
        使用
        <code>normalizer</code> 属性将非标准数据格式映射为组件可识别的格式。
        示例中将
        <code>key</code
        >→<code>id</code>、<code>name</code>→<code>label</code>、<code>subItems</code>→<code
          >children</code
        >
        进行映射。
      </p>
      <div class="example-content">
        <Treeselect
          v-model="normalizerValue"
          :options="customKeyOptions"
          :normalizer="normalizer"
          placeholder="选择部门..."
        />
      </div>
      <div class="example-value">
        <strong>选中值:</strong> {{ normalizerValue || "none" }}
      </div>
    </div>

    <!-- 2. Customize Option Label - 使用 option-label slot -->
    <div class="demo-section">
      <h3 class="section-title">2. Customize Option Label</h3>
      <p class="section-description">
        使用 <code>option-label</code> slot
        自定义下拉列表中选项的显示样式，可以添加图标、徽章等额外信息。
      </p>
      <div class="example-content">
        <Treeselect
          v-model="optionLabelValue"
          :options="optionsWithIcons"
          placeholder="选择文件类型或状态..."
        >
          <template #option-label="{ node }">
            <span class="custom-option-label">
              <span class="option-icon">{{ node.raw.icon }}</span>
              <span class="option-text">{{ node.label }}</span>
              <span v-if="node.raw.size" class="option-badge size-badge">{{
                node.raw.size
              }}</span>
              <span
                v-if="node.raw.priority"
                class="option-badge priority-badge"
                >{{ node.raw.priority }}</span
              >
            </span>
          </template>
        </Treeselect>
      </div>
      <div class="example-value">
        <strong>选中值:</strong> {{ optionLabelValue || "none" }}
      </div>
    </div>

    <!-- 3. Customize Value Label - 使用 value-label slot -->
    <div class="demo-section">
      <h3 class="section-title">3. Customize Value Label</h3>
      <p class="section-description">
        使用 <code>value-label</code> slot 自定义选中值在输入框中的显示样式。
      </p>
      <div class="example-content">
        <Treeselect
          v-model="valueLabelValue"
          :options="optionsWithDetails"
          placeholder="选择员工..."
        >
          <template #option-label="{ node }">
            <span class="custom-option-label">
              <span class="option-avatar">{{ node.raw.avatar }}</span>
              <span class="option-info">
                <span class="option-name">{{ node.label }}</span>
                <span class="option-role"
                  >{{ node.raw.role }} · {{ node.raw.department }}</span
                >
              </span>
            </span>
          </template>
          <template #value-label="{ node }">
            <span class="custom-value-label">
              <span class="value-avatar">{{ node.raw.avatar }}</span>
              <span class="value-text">
                <span class="value-name">{{ node.label }}</span>
                <span class="value-role">{{ node.raw.role }}</span>
              </span>
            </span>
          </template>
        </Treeselect>
      </div>
      <div class="example-value">
        <strong>选中值:</strong> {{ valueLabelValue || "none" }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.example {
  max-width: 700px;
}

.example-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.example-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
}

.section-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.section-description code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 12px;
  color: #e83e8c;
}

.example-content {
  margin-bottom: 16px;
}

.example-value {
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
}

/* 自定义选项标签样式 */
.custom-option-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-icon {
  font-size: 16px;
}

.option-text {
  flex: 1;
}

.option-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.size-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.priority-badge {
  background: #fff3e0;
  color: #f57c00;
}

/* 员工信息样式 */
.option-avatar {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-name {
  font-weight: 500;
  font-size: 14px;
}

.option-role {
  font-size: 12px;
  color: #888;
}

/* 自定义值标签样式 */
.custom-value-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.value-avatar {
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.value-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.value-name {
  font-weight: 500;
  font-size: 13px;
  line-height: 1.2;
}

.value-role {
  font-size: 11px;
  color: #888;
  line-height: 1.2;
}
</style>
