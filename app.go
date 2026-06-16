package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
	cmd *exec.Cmd
}

type WailsWriter struct {
	ctx context.Context
}

func (w *WailsWriter) Write(p []byte) (int, error) {
	str := string(p)
	runtime.EventsEmit(w.ctx, "log_line", str+"\n")
	return len(p), nil
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
	if a.cmd != nil && a.cmd.Process != nil {
		pid := a.cmd.Process.Pid
		exec.Command("taskkill", "/F", "/T", "/PID", fmt.Sprintf("%d", pid)).Run()
		a.cmd = nil
	}
}

func (a *App) SelectFolder() string {
	folderPath, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{Title: "Выберите директорию для сохранения файла"})
	if err != nil {
		fmt.Println("Ошибка при выборе директории:", err)
		return ""
	}
	return folderPath
}

func (a *App) Download(url string, folder string, format string, browser string, sound bool, exit bool, open bool) error {
	var trimmed_url = strings.TrimSpace(url)
	var trimmed_folder = strings.TrimSpace(folder)

	args := []string{".\\bin\\yt-dlp",
		"--js-runtimes",
		"node:.\\bin\\node.exe",
		"--remote-components",
		"ejs:npm",
		"--cookies-from-browser",
		browser,
		"--extract-audio",
		"--audio-format", format,
		"--audio-quality", "0",
		"--embed-thumbnail",
		"--add-metadata",
		"-P",
		trimmed_folder,
		"-o", "%(title)s.%(ext)s",
		trimmed_url}

	fmt.Println("Начинается загрузка медиа:")

	cmd := exec.Command(args[0], args[1:]...)
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: 0x08000000}

	writer := &WailsWriter{ctx: a.ctx}
	cmd.Stdout = writer
	cmd.Stderr = writer

	a.cmd = cmd

	err := a.cmd.Run()
	if err != nil {
		fmt.Println("Загрузка остановлена или завершилась с ошибкой:", err)
		return err
	}

	fmt.Println("Готово. Ознакомьтесь с результатами работы программы.")
	if sound {
		beepFunc, _ := syscall.MustLoadDLL("user32.dll").FindProc("MessageBeep")
		beepFunc.Call(0xFFFFFFFF)
	}
	if exit {
		os.Exit(0)
	}
	if open {
		exec.Command("explorer", trimmed_folder).Start()
	}

	return nil
}

func (a *App) CancelDownload() error {
	if a.cmd == nil || a.cmd.Process == nil {
		return fmt.Errorf("Нет активной загрузки")
	}

	pid := a.cmd.Process.Pid
	err := exec.Command("taskkill", "/F", "/T", "/PID", fmt.Sprintf("%d", pid)).Run()
	a.cmd = nil
	return err
}
