#include <X11/Xlib.h>
#include <X11/extensions/XInput2.h>
#include <stdio.h>
#include <string.h>
#include <X11/keysym.h>
#include <X11/XKBlib.h>

int isModifier(unsigned int keycode, Display *dpy) {
    KeySym ks = XKeycodeToKeysym(dpy, keycode, 0);
    return ks == XK_Shift_L || ks == XK_Shift_R ||
           ks == XK_Control_L || ks == XK_Control_R ||
           ks == XK_Alt_L || ks == XK_Alt_R;
}

unsigned int getModifierMask(Display *dpy) {
    char keys[32];
    XQueryKeymap(dpy, keys);

    unsigned int mask = 0;
    for (int i = 0; i < 256; i++) {
        if (keys[i / 8] & (1 << (i % 8))) {
            KeySym ks = XKeycodeToKeysym(dpy, i, 0);
            if (ks == XK_Shift_L || ks == XK_Shift_R) mask |= ShiftMask;
            if (ks == XK_Control_L || ks == XK_Control_R) mask |= ControlMask;
            if (ks == XK_Alt_L || ks == XK_Alt_R) mask |= Mod1Mask;
        }
    }
    return mask;
}

int main() {
    Display *dpy = XOpenDisplay(NULL);
    if (!dpy) return 1;

    Window root = DefaultRootWindow(dpy);

    int opcode, event, error;
    if (!XQueryExtension(dpy, "XInputExtension", &opcode, &event, &error)) {
        printf("XInput extension not available\n");
        return 1;
    }

    XIEventMask mask;
    unsigned char mask_bits[(XI_LASTEVENT + 7)/8];
    memset(mask_bits, 0, sizeof(mask_bits));
    mask.deviceid = XIAllMasterDevices;
    mask.mask_len = sizeof(mask_bits);
    mask.mask = mask_bits;
    XISetMask(mask.mask, XI_RawKeyPress);
    XISetMask(mask.mask, XI_RawKeyRelease);

    XISelectEvents(dpy, root, &mask, 1);
    XFlush(dpy);

    while (1) {
        XEvent ev;
        XNextEvent(dpy, &ev);

        if (ev.xcookie.type == GenericEvent && ev.xcookie.extension == opcode &&
            XGetEventData(dpy, &ev.xcookie)) {

            XIRawEvent *re = (XIRawEvent*) ev.xcookie.data;

            unsigned int mods = getModifierMask(dpy);
            printf("Raw keycode: %d, Modifier mask: 0x%x\n", re->detail, mods);

            XFreeEventData(dpy, &ev.xcookie);
        }
        //if(ev.type == GenericEvent && ev.xcookie.extension == opcode) {
        //    XGetEventData(dpy, &ev.xcookie);
        //    XIRawEvent *re = (XIRawEvent*) ev.xcookie.data;
        //    KeyCode keycode = re->detail;
        //    KeySym ks = XkbKeycodeToKeysym(dpy, keycode, 0, 0);
        //    if(ks == NoSymbol) {
        //        XFreeEventData(dpy, &ev.xcookie);
        //        continue;
        //    }
        //    printf("%d %u", keycode, mask);
        //    fflush(stdout);
        //    XFreeEventData(dpy, &ev.xcookie);
        //}
    }
}

