using System.Reflection;
using System.Text.Json;

namespace FlexTree {
    public class JobChain {
        public JobChain(string jobId, Stack<string> currentSections, BackgroundTaskContextFactory contextFactory, CancellationToken cancellationToken) {
            _jobId = jobId;
            _currentSections = currentSections;
            _contextFactory = contextFactory;
            _cancellationToken = cancellationToken;
        }

        protected readonly string _jobId;
        protected readonly Stack<string> _currentSections;
        protected readonly BackgroundTaskContextFactory _contextFactory;
        protected readonly CancellationToken _cancellationToken;

        private bool _initialized = false;

        protected T SectionBase<T>(string sectionName, Func<BackgroundTaskContext> createContext, Func<BackgroundTaskContext, T> execute) {
            using var context = createContext();
            try {
                _cancellationToken.ThrowIfCancellationRequested();

                if (!_initialized) {
                    _initialized = true;
                    Directory.CreateDirectory(context.WorkingDirectory);
                }

                _currentSections.Push(sectionName);
                context.Logger.LogInformation("処理開始: {Section}", string.Join(" > ", _currentSections.Reverse()));
                var returnValue = execute(context);
                context.Logger.LogInformation("処理終了: {Section}", string.Join(" > ", _currentSections.Reverse()));
                _currentSections.Pop();

                return returnValue;

            } catch (OperationCanceledException) {
                context.Logger.LogInformation("処理がキャンセルされました。");
                throw;

            } catch (Exception ex) {
                context.Logger.LogInformation(ex, "処理「{Section}」中にエラーが発生しました: {Message}", sectionName, ex.Message);
                throw;
            }
        }

        public JobChain Section(string sectionName, Action<BackgroundTaskContext> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                callback(context);
                return this;
            });
        }
        public JobChain<TReturnType> Section<TReturnType>(string sectionName, Func<BackgroundTaskContext, TReturnType> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var result = callback(context);
                return new JobChain<TReturnType>(result, _jobId, _currentSections, _contextFactory, _cancellationToken);
            });
        }
        public JobChain Section(string sectionName, Func<BackgroundTaskContext, Task> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var task = callback(context);
                task.Wait();
                return this;
            });
        }
        public JobChain<TReturnType> Section<TReturnType>(string sectionName, Func<BackgroundTaskContext, Task<TReturnType>> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var task = callback(context);
                task.Wait();
                return new JobChain<TReturnType>(task.Result, _jobId, _currentSections, _contextFactory, _cancellationToken);
            });
        }
    }
    public sealed class JobChain<TSectionInput> : JobChain {
        public JobChain(TSectionInput sectionInput, string jobId, Stack<string> currentSections, BackgroundTaskContextFactory contextFactory, CancellationToken cancellationToken)
            : base(jobId, currentSections, contextFactory, cancellationToken) {
            _sectionInput = sectionInput;
        }

        private readonly TSectionInput _sectionInput;

        public JobChain Section(string sectionName, Action<BackgroundTaskContext, TSectionInput> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                callback(context, _sectionInput);
                return this;
            });
        }
        public JobChain Section(string sectionName, Func<BackgroundTaskContext, TSectionInput, Task> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var task = callback(context, _sectionInput);
                task.Wait();
                return this;
            });
        }
        public JobChain<TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext, TSectionInput, TSectionOutput> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var result = callback(context, _sectionInput);
                return new JobChain<TSectionOutput>(result, _jobId, _currentSections, _contextFactory, _cancellationToken);
            });
        }
        public JobChain<TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext, TSectionInput, Task<TSectionOutput>> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId);
            }, context => {
                var task = callback(context, _sectionInput);
                task.Wait();
                return new JobChain<TSectionOutput>(task.Result, _jobId, _currentSections, _contextFactory, _cancellationToken);
            });
        }
    }
    public class JobChainWithParameter<TParameter> : JobChain {
        public JobChainWithParameter(string jobId, TParameter parameter, Stack<string> currentSections, BackgroundTaskContextFactory contextFactory, CancellationToken cancellationToken)
            : base(jobId, currentSections, contextFactory, cancellationToken) {
            _parameter = parameter;
        }

        private readonly TParameter _parameter;

        public JobChainWithParameter<TParameter> Section(string sectionName, Action<BackgroundTaskContext<TParameter>> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                callback((BackgroundTaskContext<TParameter>)context);
                return this;
            });
        }
        public JobChainWithParameter<TParameter> Section(string sectionName, Func<BackgroundTaskContext<TParameter>, Task> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var task = callback((BackgroundTaskContext<TParameter>)context);
                task.Wait();
                return this;
            });
        }
        public JobChainWithParameter<TParameter, TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext<TParameter>, TSectionOutput> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var result = callback((BackgroundTaskContext<TParameter>)context);
                return new JobChainWithParameter<TParameter, TSectionOutput>(result, _jobId, _parameter, _currentSections, _contextFactory, _cancellationToken);
            });
        }
        public JobChainWithParameter<TParameter, TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext<TParameter>, Task<TSectionOutput>> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var task = callback((BackgroundTaskContext<TParameter>)context);
                task.Wait();
                return new JobChainWithParameter<TParameter, TSectionOutput>(task.Result, _jobId, _parameter, _currentSections, _contextFactory, _cancellationToken);
            });
        }
    }
    public class JobChainWithParameter<TParameter, TSectionInput> : JobChain {
        public JobChainWithParameter(TSectionInput sectionInput, string jobId, TParameter parameter, Stack<string> currentSections, BackgroundTaskContextFactory contextFactory, CancellationToken cancellationToken)
            : base(jobId, currentSections, contextFactory, cancellationToken) {
            _parameter = parameter;
            _sectionInput = sectionInput;
        }

        private readonly TParameter _parameter;
        private readonly TSectionInput _sectionInput;

        public JobChainWithParameter<TParameter, TSectionInput> Section(string sectionName, Action<BackgroundTaskContext<TParameter>, TSectionInput> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                callback((BackgroundTaskContext<TParameter>)context, _sectionInput);
                return this;
            });
        }
        public JobChainWithParameter<TParameter, TSectionInput> Section(string sectionName, Func<BackgroundTaskContext<TParameter>, TSectionInput, Task> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var task = callback((BackgroundTaskContext<TParameter>)context, _sectionInput);
                task.Wait();
                return this;
            });
        }
        public JobChainWithParameter<TParameter, TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext<TParameter>, TSectionInput, TSectionOutput> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var result = callback((BackgroundTaskContext<TParameter>)context, _sectionInput);
                return new JobChainWithParameter<TParameter, TSectionOutput>(result, _jobId, _parameter, _currentSections, _contextFactory, _cancellationToken);
            });
        }
        public JobChainWithParameter<TParameter, TSectionOutput> Section<TSectionOutput>(string sectionName, Func<BackgroundTaskContext<TParameter>, TSectionInput, Task<TSectionOutput>> callback) {
            return SectionBase(sectionName, () => {
                return _contextFactory.CraeteScopedContext(_jobId, _parameter);
            }, context => {
                var task = callback((BackgroundTaskContext<TParameter>)context, _sectionInput);
                task.Wait();
                return new JobChainWithParameter<TParameter, TSectionOutput>(task.Result, _jobId, _parameter, _currentSections, _contextFactory, _cancellationToken);
            });
        }
    }
}
