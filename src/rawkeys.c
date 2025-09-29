#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>
#include <X11/extensions/XInput2.h>
#include <X11/XKBlib.h>

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    Display *dpy = XOpenDisplay(NULL);
    if (!dpy) {
        fprintf(stderr, "Failed to open display\n");
        return 1;
    }

    int xi_opcode, event, error;
    if (!XQueryExtension(dpy, "XInputExtension", &xi_opcode, &event, &error)) {
        fprintf(stderr, "X Input extension not available\n");
        return 1;
    }

    int major = 2, minor = 0;
    if (XIQueryVersion(dpy, &major, &minor) == BadRequest) {
        fprintf(stderr, "XI2 not available. Need version 2.0 or higher\n");
        return 1;
    }

    Window root = DefaultRootWindow(dpy);

    XIEventMask evmask;
    unsigned char mask[XIMaskLen(XI_RawKeyPress)] = {0};
    evmask.deviceid = XIAllMasterDevices;
    evmask.mask_len = sizeof(mask);
    evmask.mask = mask;
    XISetMask(mask, XI_RawKeyPress);
    XISetMask(mask, XI_RawKeyRelease);

    XISelectEvents(dpy, root, &evmask, 1);
    XSync(dpy, False);

    //printf("Listening for raw key events...\n");

    while (1) {
        XEvent ev;
        XNextEvent(dpy, &ev);

        if (ev.xcookie.type == GenericEvent &&
            ev.xcookie.extension == xi_opcode &&
            XGetEventData(dpy, &ev.xcookie)) {

            if (ev.xcookie.evtype == XI_RawKeyPress ||
                ev.xcookie.evtype == XI_RawKeyRelease) {

                XIRawEvent *re = (XIRawEvent *) ev.xcookie.data;
                unsigned int keycode = re->detail;

                // Query the global modifier state here:
                XkbStateRec state;
                XkbGetState(dpy, XkbUseCoreKbd, &state);

                printf("%s: keycode=%u, mask=0x%x\n",
                       ev.xcookie.evtype == XI_RawKeyPress ? "press" : "release",
                       keycode, state.mods);
            }

            XFreeEventData(dpy, &ev.xcookie);
        }
    }

    XCloseDisplay(dpy);
    return 0;
}

