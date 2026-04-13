<script setup lang="ts">
import { ref } from "vue";
import Treeselect from "vue3-treeselect";

const value = ref<string | null>(null);

const options = [
  {
    id: "اللغة-العربية",
    label: "اللغة العربية (Arabic)",
    children: [
      { id: "مرحبا", label: "مرحبا (Hello)" },
      { id: "شكرا", label: "شكرا (Thank you)" },
    ],
  },
  {
    id: "עברית",
    label: "עברית (Hebrew)",
    children: [
      { id: "שלום", label: "שלום (Hello)" },
      { id: "תודה", label: "תודה (Thank you)" },
    ],
  },
];
</script>

<template>
  <div class="example">
    <h2 class="example-title">RTL Support</h2>
    <p class="example-description">
      Demonstrates right-to-left (RTL) layout support for languages like Arabic
      and Hebrew. The entire container has <code>dir="rtl"</code> which flips
      the layout direction. Notice how the dropdown menu, arrows, and text all
      align correctly for RTL users.
    </p>
    <div class="example-content">
      <div dir="rtl" style="text-align: right">
        <Treeselect
          v-model="value"
          :options="options"
          placeholder="اختر خياراً..."
        />
      </div>
    </div>
    <div class="example-value">
      <strong>Selected value:</strong> {{ value || "none" }}
    </div>
  </div>
</template>

<style scoped>
.example {
  max-width: 600px;
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
  margin: 0 b 24px 0;
  line-height: 1.6;
}

.example-description code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 13px;
}

.example-content {
  margin-bottom: 20px;
}

.example-value {
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}
</style>
