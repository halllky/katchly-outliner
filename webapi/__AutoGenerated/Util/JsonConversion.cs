namespace Katchly {
    using System.Text.Json;
    using System.Text.Json.Nodes;

    static partial class Util {
        public static void ModifyJsonSrializerOptions(JsonSerializerOptions option) {
            // 日本語文字がUnicode変換されるのを避ける
            option.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All);

            // json中のenumの値を名前で設定できるようにする
            var enumConverter = new System.Text.Json.Serialization.JsonStringEnumConverter();
            option.Converters.Add(enumConverter);

            // カスタムコンバータ
            option.Converters.Add(new CustomJsonConverters.IntegerValueConverter());
            option.Converters.Add(new CustomJsonConverters.DateTimeValueConverter());

            option.Converters.Add(new CustomJsonConverters.RowKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.AttrsKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.RowOrderKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.RowTypeKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.ColumnsKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentTargetRowKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentTargetCellKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentTargetRowTypeKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentTargetColumnKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.CommentTargetCommentKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.LogKeysJsonValueConverter());
        }
        public static JsonSerializerOptions GetJsonSrializerOptions() {
            var option = new System.Text.Json.JsonSerializerOptions();
            ModifyJsonSrializerOptions(option);
            return option;
        }

        public static string ToJson<T>(this T obj) {
            return JsonSerializer.Serialize(obj, GetJsonSrializerOptions());
        }
        public static T ParseJson<T>(string? json) {
            if (json == null) throw new ArgumentNullException(nameof(json));
            return JsonSerializer.Deserialize<T>(json, GetJsonSrializerOptions())!;
        }
        public static object ParseJson(string? json, Type type) {
            if (json == null) throw new ArgumentNullException(nameof(json));
            return JsonSerializer.Deserialize(json, type, GetJsonSrializerOptions())!;
        }
        /// <summary>
        /// 単に <see cref="JsonSerializer.Deserialize(JsonElement, Type, JsonSerializerOptions?)"/> で object?[] を指定すると JsonElement[] 型になり各要素のキャストができないためその回避
        /// </summary>
        public static object?[] ParseJsonAsObjectArray(string? json) {
            return ParseJson<JsonElement[]>(json)
                .Select(jsonElement => (object?)(jsonElement.ValueKind switch {
                    JsonValueKind.Undefined => null,
                    JsonValueKind.Null => null,
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.String => jsonElement.GetString(),
                    JsonValueKind.Number => jsonElement.GetDecimal(),
                    _ => jsonElement,
                }))
                .ToArray();
        }
        /// <summary>
        /// JSONから復元されたオブジェクトを事後的に特定の型として扱いたいときに用いる
        /// </summary>
        public static T EnsureObjectType<T>(object? obj) where T : new() {
            return (T)EnsureObjectType(obj, typeof(T));
        }
        /// <summary>
        /// JSONから復元されたオブジェクトを事後的に特定の型として扱いたいときに用いる
        /// </summary>
        public static object EnsureObjectType(object? obj, Type type) {
            if (obj == null) return Activator.CreateInstance(type) ?? throw new ArgumentException(nameof(type));
            var json = obj as string ?? ToJson(obj);
            return ParseJson(json, type);
        }
    }
}

namespace Katchly.CustomJsonConverters {
    using System.Text;
    using System.Text.Json;
    using System.Text.Json.Serialization;

    class IntegerValueConverter : JsonConverter<int?> {
        public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
    
            return reader.TryGetDecimal(out var dec)
                ? (int)dec
                : null;
    
            // var jsonValue = reader.GetString()?.Trim();
            // if (jsonValue == null) return null;
            // 
            // var builder = new StringBuilder();
            // foreach (var character in jsonValue) {
            //     if (character == ',' || character == '，') {
            //         // カンマ区切りは無視
            //         continue;
            //     } else if (character == '.' || character == '．') {
            //         // 小数点以下は切り捨て
            //         break;
            //     } else if (char.IsDigit(character)) {
            //         // 全角数値は半角数値に変換
            //         builder.Append(char.GetNumericValue(character));
            //     } else {
            //         builder.Append(character);
            //     }
            // }
            // 
            // var converted = builder.ToString();
            // return string.IsNullOrEmpty(converted) ? null : int.Parse(converted);
        }
    
        public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
            } else {
                writer.WriteNumberValue((decimal)value);
            }
            // writer.WriteStringValue(value?.ToString());
        }
    }
    class DateTimeValueConverter : JsonConverter<DateTime?> {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var strDateTime = reader.GetString();
            return string.IsNullOrWhiteSpace(strDateTime)
                ? null
                : DateTime.Parse(strDateTime);
        }
    
        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
            } else {
                writer.WriteStringValue(value.Value.ToString("yyyy-MM-dd HH:mm:ss"));
            }
        }
    }

    /// <summary>
    /// <see cref="RowKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class RowKeysJsonValueConverter : JsonConverter<RowKeys?> {
        public override RowKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"RowKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new RowKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, RowKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="AttrsKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class AttrsKeysJsonValueConverter : JsonConverter<AttrsKeys?> {
        public override AttrsKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Attrs_IDValue = objArray.ElementAtOrDefault(0);
            if (Attrs_IDValue != null && Attrs_IDValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。Attrs_IDの位置の値がstring型ではありません: {Attrs_IDValue}");
    
            var ColType_Columns_IDValue = objArray.ElementAtOrDefault(1);
            if (ColType_Columns_IDValue != null && ColType_Columns_IDValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。ColType_Columns_IDの位置の値がstring型ではありません: {ColType_Columns_IDValue}");
    
            var ColType_ColumnIdValue = objArray.ElementAtOrDefault(2);
            if (ColType_ColumnIdValue != null && ColType_ColumnIdValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。ColType_ColumnIdの位置の値がstring型ではありません: {ColType_ColumnIdValue}");
    
            return new AttrsKeys {
                Parent = new() {
                    ID = (string?)Attrs_IDValue,
                },
                ColType = new() {
                    Parent = new() {
                        ID = (string?)ColType_Columns_IDValue,
                    },
                    ColumnId = (string?)ColType_ColumnIdValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, AttrsKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.ColType?.Parent?.ID,
                    value.ColType?.ColumnId,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="RowOrderKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class RowOrderKeysJsonValueConverter : JsonConverter<RowOrderKeys?> {
        public override RowOrderKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Row_IDValue = objArray.ElementAtOrDefault(0);
            if (Row_IDValue != null && Row_IDValue is not string)
                throw new InvalidOperationException($"RowOrderKeysの値の変換に失敗しました。Row_IDの位置の値がstring型ではありません: {Row_IDValue}");
    
            return new RowOrderKeys {
                Row = new() {
                    ID = (string?)Row_IDValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, RowOrderKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Row?.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="RowTypeKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class RowTypeKeysJsonValueConverter : JsonConverter<RowTypeKeys?> {
        public override RowTypeKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"RowTypeKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new RowTypeKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, RowTypeKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="ColumnsKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class ColumnsKeysJsonValueConverter : JsonConverter<ColumnsKeys?> {
        public override ColumnsKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Columns_IDValue = objArray.ElementAtOrDefault(0);
            if (Columns_IDValue != null && Columns_IDValue is not string)
                throw new InvalidOperationException($"ColumnsKeysの値の変換に失敗しました。Columns_IDの位置の値がstring型ではありません: {Columns_IDValue}");
    
            var ColumnIdValue = objArray.ElementAtOrDefault(1);
            if (ColumnIdValue != null && ColumnIdValue is not string)
                throw new InvalidOperationException($"ColumnsKeysの値の変換に失敗しました。ColumnIdの位置の値がstring型ではありません: {ColumnIdValue}");
    
            return new ColumnsKeys {
                Parent = new() {
                    ID = (string?)Columns_IDValue,
                },
                ColumnId = (string?)ColumnIdValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, ColumnsKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.ColumnId,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentKeysJsonValueConverter : JsonConverter<CommentKeys?> {
        public override CommentKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"CommentKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new CommentKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentTargetRowKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentTargetRowKeysJsonValueConverter : JsonConverter<CommentTargetRowKeys?> {
        public override CommentTargetRowKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var CommentTargetRow_IDValue = objArray.ElementAtOrDefault(0);
            if (CommentTargetRow_IDValue != null && CommentTargetRow_IDValue is not string)
                throw new InvalidOperationException($"CommentTargetRowKeysの値の変換に失敗しました。CommentTargetRow_IDの位置の値がstring型ではありません: {CommentTargetRow_IDValue}");
    
            return new CommentTargetRowKeys {
                Parent = new() {
                    ID = (string?)CommentTargetRow_IDValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentTargetRowKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentTargetCellKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentTargetCellKeysJsonValueConverter : JsonConverter<CommentTargetCellKeys?> {
        public override CommentTargetCellKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var CommentTargetCell_IDValue = objArray.ElementAtOrDefault(0);
            if (CommentTargetCell_IDValue != null && CommentTargetCell_IDValue is not string)
                throw new InvalidOperationException($"CommentTargetCellKeysの値の変換に失敗しました。CommentTargetCell_IDの位置の値がstring型ではありません: {CommentTargetCell_IDValue}");
    
            return new CommentTargetCellKeys {
                Parent = new() {
                    ID = (string?)CommentTargetCell_IDValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentTargetCellKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentTargetRowTypeKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentTargetRowTypeKeysJsonValueConverter : JsonConverter<CommentTargetRowTypeKeys?> {
        public override CommentTargetRowTypeKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var CommentTargetRowType_IDValue = objArray.ElementAtOrDefault(0);
            if (CommentTargetRowType_IDValue != null && CommentTargetRowType_IDValue is not string)
                throw new InvalidOperationException($"CommentTargetRowTypeKeysの値の変換に失敗しました。CommentTargetRowType_IDの位置の値がstring型ではありません: {CommentTargetRowType_IDValue}");
    
            return new CommentTargetRowTypeKeys {
                Parent = new() {
                    ID = (string?)CommentTargetRowType_IDValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentTargetRowTypeKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentTargetColumnKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentTargetColumnKeysJsonValueConverter : JsonConverter<CommentTargetColumnKeys?> {
        public override CommentTargetColumnKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var CommentTargetColumn_IDValue = objArray.ElementAtOrDefault(0);
            if (CommentTargetColumn_IDValue != null && CommentTargetColumn_IDValue is not string)
                throw new InvalidOperationException($"CommentTargetColumnKeysの値の変換に失敗しました。CommentTargetColumn_IDの位置の値がstring型ではありません: {CommentTargetColumn_IDValue}");
    
            return new CommentTargetColumnKeys {
                Parent = new() {
                    ID = (string?)CommentTargetColumn_IDValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentTargetColumnKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="CommentTargetCommentKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class CommentTargetCommentKeysJsonValueConverter : JsonConverter<CommentTargetCommentKeys?> {
        public override CommentTargetCommentKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var CommentTargetComment_IDValue = objArray.ElementAtOrDefault(0);
            if (CommentTargetComment_IDValue != null && CommentTargetComment_IDValue is not string)
                throw new InvalidOperationException($"CommentTargetCommentKeysの値の変換に失敗しました。CommentTargetComment_IDの位置の値がstring型ではありません: {CommentTargetComment_IDValue}");
    
            var CommentIdValue = objArray.ElementAtOrDefault(1);
            if (CommentIdValue != null && CommentIdValue is not string)
                throw new InvalidOperationException($"CommentTargetCommentKeysの値の変換に失敗しました。CommentIdの位置の値がstring型ではありません: {CommentIdValue}");
    
            return new CommentTargetCommentKeys {
                Parent = new() {
                    ID = (string?)CommentTargetComment_IDValue,
                },
                CommentId = (string?)CommentIdValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, CommentTargetCommentKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.CommentId,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="LogKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class LogKeysJsonValueConverter : JsonConverter<LogKeys?> {
        public override LogKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"LogKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new LogKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, LogKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

}
