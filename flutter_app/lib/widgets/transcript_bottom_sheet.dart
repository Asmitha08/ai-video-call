import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../models/caption_model.dart';
import '../models/language_model.dart';

class TranscriptBottomSheet extends StatelessWidget {
  final List<CaptionModel> transcriptHistory;
  final Function(String text, String langCode)? onSpeakText;

  const TranscriptBottomSheet({
    super.key,
    required this.transcriptHistory,
    this.onSpeakText,
  });

  @override
  Widget build(BuildContext context) {
    final timeFormat = DateFormat('HH:mm:ss');

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: Color(0xFF1E1E2E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 48,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                const Icon(Icons.history_rounded, color: Color(0xFF818CF8)),
                const SizedBox(width: 8),
                const Text(
                  'Call Transcript & Translations',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.copy_rounded, color: Colors.white70, size: 20),
                  tooltip: 'Copy Full Transcript',
                  onPressed: () {
                    final text = transcriptHistory
                        .map((c) => '[${timeFormat.format(DateTime.fromMillisecondsSinceEpoch(c.timestamp))}] ${c.displayName}: ${c.originalText} (Translation: ${c.translatedText})')
                        .join('\n\n');
                    Clipboard.setData(ClipboardData(text: text));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Transcript copied to clipboard')),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: Colors.white70),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.white12, height: 1),

          // Transcript List
          Expanded(
            child: transcriptHistory.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.mic_none_rounded, size: 48, color: Colors.white.withOpacity(0.3)),
                        const SizedBox(height: 12),
                        Text(
                          'No speech transcribed yet.\nStart speaking in the call!',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white.withOpacity(0.5)),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: transcriptHistory.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = transcriptHistory[index];
                      final timeStr = timeFormat.format(
                        DateTime.fromMillisecondsSinceEpoch(item.timestamp),
                      );
                      final sLang = Language.getByCode(item.sourceLang);
                      final tLang = Language.getByCode(item.targetLang);

                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2A2A3E),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  item.displayName,
                                  style: const TextStyle(
                                    color: Color(0xFF818CF8),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '${sLang.flag} → ${tLang.flag}',
                                  style: const TextStyle(fontSize: 12),
                                ),
                                const Spacer(),
                                Text(
                                  timeStr,
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.4),
                                    fontSize: 11,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                if (onSpeakText != null)
                                  InkWell(
                                    onTap: () => onSpeakText?.call(item.translatedText, item.targetLang),
                                    child: const Padding(
                                      padding: EdgeInsets.all(4.0),
                                      child: Icon(Icons.volume_up_rounded, size: 16, color: Color(0xFF38BDF8)),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            // Translated Text
                            Text(
                              item.translatedText,
                              style: const TextStyle(
                                color: Color(0xFFE2E8F0),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            if (item.originalText != item.translatedText) ...[
                              const SizedBox(height: 4),
                              Text(
                                item.originalText,
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.5),
                                  fontSize: 12,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
