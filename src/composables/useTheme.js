/**
 * 主题管理逻辑
 */
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { THEME_CONFIG } from '@/utils/baseConfig';

export function useTheme() {
  const theme = ref(THEME_CONFIG.defaultTheme);
  
  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    applyTheme(theme.value);
  };
  
  // 应用主题
  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    const themeVars = THEME_CONFIG[selectedTheme];
    
    // 立即应用主题类名到body
    if (selectedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // 强制回流和重绘以确保样式正确应用
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight;
    
    // 设置CSS变量
    root.style.setProperty('--theme-color', themeVars.primaryColor);
    root.style.setProperty('--theme-color-rgb', themeVars.primaryColorRgb);
    
    // 使用计算的hover变量
    root.style.setProperty('--theme-hover-color', themeVars.primaryColorHover);
    root.style.setProperty('--primary-color-hover', themeVars.primaryColorHover);
    
    // 添加延迟，确保背景颜色在DOM渲染后应用
    root.style.setProperty('--background-color', themeVars.backgroundColor);
    root.style.setProperty('--card-background', themeVars.cardBackground);
    root.style.setProperty('--text-color', themeVars.textColor);
    root.style.setProperty('--secondary-text-color', themeVars.secondaryTextColor);
    root.style.setProperty('--border-color', themeVars.borderColor);
    root.style.setProperty('--shadow-color', themeVars.shadowColor);
    
    // 为深色模式设置一个明确的卡片背景
    if (selectedTheme === 'dark') {
      document.querySelectorAll('.auth-card').forEach(card => {
        // 确保卡片背景在深色模式下更明确，不依赖CSS变量
        card.style.backgroundColor = '#1e1e1e';
        card.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
      });
    } else {
      document.querySelectorAll('.auth-card').forEach(card => {
        // 恢复卡片背景样式为CSS变量
        card.style.backgroundColor = '';
        card.style.boxShadow = '';
      });
    }
  };
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark';
    }
    
    // 在DOM完全加载后应用主题
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyTheme(theme.value);
      });
    } else {
      applyTheme(theme.value);
    }
  };
  
  // 监听主题变化
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });
  
  // 监听系统主题变化
  const handleSystemThemeChange = (e) => {
    if (!localStorage.getItem('theme')) {
      theme.value = e.matches ? 'dark' : 'light';
    }
  };
  
  onMounted(() => {
    initTheme();
    
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
    }
  });
  
  onUnmounted(() => {
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeQuery.removeEventListener('change', handleSystemThemeChange);
    }
  });
  
  return {
    theme,
    toggleTheme,
    applyTheme
  };
} 