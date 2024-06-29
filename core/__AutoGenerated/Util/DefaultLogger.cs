﻿namespace Katchly {
    using Microsoft.Extensions.Logging;
    using System;
    using System.IO;
    using System.Text;

    public class DefaultLogger : ILogger {
        public DefaultLogger(string? logDirectory) {
            _logDirectory = logDirectory ?? "job";
        }
        private readonly string _logDirectory;
        private bool _directoryCraeted = false;

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull {
            return default;
        }

        public bool IsEnabled(LogLevel logLevel) {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) {
            if (!_directoryCraeted) {
                if (!Directory.Exists(_logDirectory)) {
                    Directory.CreateDirectory(_logDirectory);
                }
                _directoryCraeted = true;
            }

            var now = DateTime.Now;
            var file = Path.Combine(_logDirectory, $"{now:yyyyMMdd}.log");
            using var streamWriter = new StreamWriter(file, append: true, encoding: Encoding.UTF8);
            using var textWriter = TextWriter.Synchronized(streamWriter);

            var header = $"{now:G}\t[{logLevel}]";
            textWriter.WriteLine($"{header}\t{formatter(state, exception)}");

            if (exception != null) {
                textWriter.WriteLine($"");
                textWriter.WriteLine($"{exception}");
                textWriter.WriteLine($"");
            }
        }
    }
}
