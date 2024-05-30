using System.Reflection;
using System.Text.Json;

namespace FlexTree {
    public abstract class BackgroundTask {

        /// <summary>
        /// バッチIDと対応するクラスのインスタンスを作成して返します。
        /// </summary>
        public static BackgroundTask FindTaskByID(string batchType) {
            var assembly = Assembly.GetExecutingAssembly();
            foreach (var type in assembly.GetTypes()) {
                if (type.IsAbstract) continue;
                if (!type.IsSubclassOf(typeof(BackgroundTask))) continue;
                try {
                    var instance = (BackgroundTask?)Activator.CreateInstance(type);
                    if (instance == null) continue;
                    if (instance.BatchTypeId != batchType) continue;
                    return instance;
                } catch {
                    continue;
                }
            }
            throw new InvalidOperationException(
                $"ジョブ種別 '{batchType}' と対応するバッチが見つかりません。" +
                $"種別の指定を誤っていないか、またそのクラスに引数なしコンストラクタがあるかを確認してください。");
        }


        public abstract string BatchTypeId { get; }

        public abstract string JobName { get; }
        public virtual string GetJobName(object? parameter) {
            return JobName;
        }

        public virtual IEnumerable<string> ValidateParameter(object? parameter) {
            yield break;
        }

        public abstract void Execute(JobChain job);
    }

    public abstract class BackgroundTask<TParameter> : BackgroundTask where TParameter : new() {

        public abstract string GetJobName(TParameter parameter);
        public override sealed string JobName => string.Empty;
        public override sealed string GetJobName(object? parameter) {
            return this.GetJobName(Util.EnsureObjectType<TParameter>(parameter));
        }

        public virtual IEnumerable<string> ValidateParameter(TParameter parameter) {
            yield break;
        }
        public override sealed IEnumerable<string> ValidateParameter(object? parameter) {
            return this.ValidateParameter(Util.EnsureObjectType<TParameter>(parameter));
        }

        public abstract void Execute(JobChainWithParameter<TParameter> job);
        public override sealed void Execute(JobChain job) {
            Execute((JobChainWithParameter<TParameter>)job);
        }
    }
}
