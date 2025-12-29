import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';

export function useWindow() {
    let webview;

    const createNewWindow = async (url,title,label='setting',options = {}) => {
        try {
            const defaultOptions = {
                x: 0,
                y: 0,
                url: url,
                title: title,
                width: 1080/2,
                height: 1920/2,
                center: true,
                transparent: true,
                decorations: true,
                alwaysOnTop: true,
                minimizable: false,
                maximizable: false,
                skipTaskbar: false,
                resizable: false,
                fullscreen: false,
                dragDropEnabled: true,
                backgroundColor: '#000000',
            
            };

            webview = new WebviewWindow(label, {
                ...defaultOptions,
                ...options
            });

            webview.emit('tauri://created');

            // 监听窗口创建事件
            webview.once('tauri://created', () => {
                console.log('窗口创建成功');
            });

            // 监听错误事件
            webview.once('tauri://error', (e) => {
                console.error('窗口创建失败:', e);
            });

            return webview;
        } catch (error) {
            console.error('创建窗口时发生错误:', error);
            throw error;
        }
    };

    const sendWindowMessage = (action, payload = {}) => {
        if (!webview) {
            console.error('窗口未创建');
            return;
        }
        webview.emit('custom-event', { message: 'Hello from main window!', action, ...payload });
    };

    const closeWindow = () => {
        if (webview) {
            webview.close();
            webview = null;
        }
    };

    return {
        createNewWindow,
        sendWindowMessage,
        closeWindow,
    };
}