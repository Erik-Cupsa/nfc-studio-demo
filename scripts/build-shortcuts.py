"""Build auditable, unsigned Apple Shortcuts; sign with Apple's CLI before sharing."""
from pathlib import Path
import plistlib
import uuid

ROOT = Path(__file__).resolve().parents[1]
for name, action in [('Studio Tap', 'rehearse'), ('Studio Cycle', 'next')]:
    random_id = str(uuid.uuid4()).upper()
    url_id = str(uuid.uuid4()).upper()
    prefix = f'https://erik-cupsa.github.io/nfc-studio-demo/?action={action}&take='
    token = {'Value': {'string': prefix + '\ufffc', 'attachmentsByRange': {
        '{%d, 1}' % len(prefix): {'OutputUUID': random_id, 'Type': 'ActionOutput', 'OutputName': 'Random Number'}
    }}, 'WFSerializationType': 'WFTextTokenString'}
    workflow = {
        'WFWorkflowName': name,
        'WFWorkflowMinimumClientVersion': 900,
        'WFWorkflowMinimumClientVersionString': '900',
        'WFWorkflowClientVersion': '4018.0.4',
        'WFWorkflowIcon': {'WFWorkflowIconStartColor': 4282601983, 'WFWorkflowIconGlyphNumber': 59511},
        'WFWorkflowActions': [
            {'WFWorkflowActionIdentifier': 'is.workflow.actions.number.random', 'WFWorkflowActionParameters': {
                'WFRandomNumberMinimum': '1', 'WFRandomNumberMaximum': '999999999', 'UUID': random_id}},
            {'WFWorkflowActionIdentifier': 'is.workflow.actions.url', 'WFWorkflowActionParameters': {'WFURLActionURL': token, 'UUID': url_id}},
            {'WFWorkflowActionIdentifier': 'is.workflow.actions.openurl', 'WFWorkflowActionParameters': {'WFInput': {'Value': {'OutputUUID': url_id, 'Type': 'ActionOutput', 'OutputName': 'URL'}, 'WFSerializationType': 'WFTextTokenAttachment'}}}
        ],
        'WFWorkflowInputContentItemClasses': [], 'WFWorkflowOutputContentItemClasses': [],
        'WFWorkflowImportQuestions': [], 'WFWorkflowTypes': [], 'WFQuickActionSurfaces': [],
        'WFWorkflowHasOutputFallback': False, 'WFWorkflowHasShortcutInputVariables': False
    }
    (ROOT / 'shortcuts' / (name + '.shortcut')).write_bytes(plistlib.dumps(workflow))
    print(name)
