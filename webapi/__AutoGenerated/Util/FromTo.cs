using System;
namespace Katchly {
    public partial class FromTo {
        public virtual object? From { get; set; }
        public virtual object? To { get; set; }
    }
    public partial class FromTo<T> : FromTo {
        public new T From {
            get => (T)base.From!;
            set => base.From = value;
        }
        public new T To {
            get => (T)base.To!;
            set => base.To = value;
        }
    }
}
