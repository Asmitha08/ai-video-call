import 'dart:ui';
import 'package:flutter/material.dart';
import '../models/caption_model.dart';
import '../models/language_model.dart';

class LiveCaptionCard extends StatelessWidget {
  final CaptionModel caption;
  final VoidCallback? onSpeakTap;

  const LiveCaptionCard({
    super.key,
    required this.caption,
    this.onSpeakTap,
  });

  @override
  Widget build(BuildContext context) {
    final sLang = Language.getByCode(caption.sourceLang);
    final tLang = Language.getByCode(caption.targetLang);

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.65),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withOpacity(0.15),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with Speaker Name & Language Badges
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.mic, size: 12, color: Colors.white),
                        const SizedBox(width: 4),
                        Text(
                          caption.displayName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${sLang.flag} ${sLang.name} → ${tLang.flag} ${tLang.name}',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Spacer(),
                  if (onSpeakTap != null)
                    InkWell(
                      onTap: onSpeakTap,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.volume_up_rounded,
                          color: Color(0xFF38BDF8),
                          size: 16,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),

              // Translated Text (Primary Highlight)
              Text(
                caption.translatedText,
                style: const TextStyle(
                  color: Color(0xFF38BDF8), // Cyan highlight for translated subtitle
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  height: 1.3,
                ),
              ),

              // Original Spoken Text (Subtle Secondary)
              if (caption.originalText.trim() != caption.translatedText.trim()) ...[
                const SizedBox(height: 4),
                Text(
                  caption.originalText,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 13,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
